#!/usr/bin/env python3
"""Build a single-file animated wireframe flow visualization from a config JSON.

    python3 build.py path/to/config.json [-o out.html] [--template template.html] [--check] [--strict]

Validates the config (see SCHEMA.md), injects it into template.html, and writes a self-contained HTML file.
Python 3 standard library only. Exit code 0 = built (warnings allowed unless --strict), 1 = config errors.

Do not set agentId or agentName. Personas, screens, and systems belong in nodes. bots may be an empty list.
Actor marks are a generic person icon. There is no product character.
"""
import argparse
import base64
import html
import json
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
sys.dont_write_bytecode = True  # keep the skill folder clean
sys.path.insert(0, str(HERE / "tools"))
try:
    import fleet_avatars as FLEET
except ImportError:  # tools/ missing: fleet lookups disabled, everything else works
    FLEET = None

PALETTE = {"black", "brown", "red", "orange", "yellow", "green", "cyan", "blue", "violet", "magenta", "gray"}
THEME_PRESETS = {"dark", "light"}
MEDIA_EXT = {".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg"}
INTERNAL_ID_RE = re.compile(r"^[A-Z][A-Z0-9_]+$")
MEDIA_WARN_BYTES = 500_000
SHAPES = {"blob", "pebble", "bean", "egg", "squircle", "tablet", "capsule", "cylinder", "hex", "gem", "crystal",
          "wedge", "shield", "dome", "arch", "cloud", "teardrop", "leaf"}
MOODS = {"idle", "listening", "thinking", "working", "happy", "excited", "curious", "surprised", "proud", "celebrate",
         "suspicious", "writing", "receiving"}
EDGE_KINDS = {"flow", "handoff", "default", "webhook", "trigger", "ingress", "cond", "conditional", "hitl", "escalation",
              "human", "aux", "artifact", "reference", "side", "optional", "feedback", "loop"}
NODE_KINDS = {"bot", "agent", "group", "groupchat", "human", "person", "system", "integration", "tool", "stage", "worker", "side"}
ROUTES = {"auto", "h", "v", "above", "below", "side"}

META_KEYS = {"title", "tagline", "subtitle", "pageTitle", "customer", "useCase", "phases", "lanes", "laneGuides", "layout", "legend",
             "theme", "stepDuration", "timeline", "autoHandoffs", "edgeLabels", "waitingLabel", "helpNote", "brandBot",
             "loop", "autoplay", "lanesAtLayout"}
ACTOR_KEYS = {"id", "kind", "name", "role", "sub", "status", "color", "shape", "emoji", "icon", "logo", "system", "lane",
              "group", "col", "row", "x", "y", "dx", "dy", "w", "h", "description", "owns", "tools", "stage",
              "conditional", "cond", "tag", "mood", "links", "seats", "initials",
              "agentId", "agentName", "avatar", "avatarOverride", "groupChat", "members"}
STEP_KEYS = {"id", "title", "label", "detail", "desc", "description", "by", "bot", "bots", "actor", "actors", "to",
             "after", "dependsOn", "duration", "tool", "artifact", "artifacts", "artifactAt", "say", "handoffs",
             "handoffLabel", "status", "kind", "phase", "trigger", "triggers", "waiting", "finale", "focus", "edges", "mood"}
EDGE_KEYS = {"id", "from", "to", "label", "kind", "loop", "route", "bend", "labelAt", "labelDx", "labelDy", "off",
             "offTo", "path"}
HANDOFF_KEYS = {"edge", "from", "to", "label", "kind", "at", "color"}
SAY_KEYS = {"who", "text", "at", "human", "mood"}
TRIGGER_KEYS = {"id", "label", "edge", "near", "t", "dx", "dy"}
ARTIFACT_OBJ_KEYS = {"label", "name", "media", "mediaDataUrl"}

COLOR_RE = re.compile(r"^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})|(rgb|hsl)a?\(.+\))$")


def as_list(v):
    if v is None:
        return []
    return v if isinstance(v, list) else [v]


def first_present(d, *keys):
    for k in keys:
        if k in d and d[k] is not None:
            return d[k]
    return None


def warn_internal_id(label, where, rep):
    if isinstance(label, str) and INTERNAL_ID_RE.match(label):
        rep.warn(f'{where}: label "{label}" looks like an internal id; use a human phrase for wireframe audiences')


def artifact_label(a):
    if isinstance(a, str):
        return a
    if isinstance(a, dict):
        return a.get("label") or a.get("name") or ""
    return str(a) if a is not None else ""


def inline_media_file(path, where, rep):
    """Read an image and return a data URL. Errors go on rep."""
    try:
        data = path.read_bytes()
    except OSError as e:
        rep.err(f"{where}: cannot read media {path}: {e}")
        return None
    ext = path.suffix.lower()
    mime = MEDIA_EXT.get(ext)
    if not mime:
        rep.err(f"{where}: media must be png/webp/jpeg, got {ext or '(no extension)'}")
        return None
    if len(data) > MEDIA_WARN_BYTES:
        rep.warn(f"{where}: media is {len(data) // 1024} KB (inlined; consider a smaller image)")
    return f"data:{mime};base64,{base64.b64encode(data).decode('ascii')}"


def process_artifact_value(a, where, cfg_dir, rep):
    """Normalize one artifact (string or object) and inline media paths."""
    if isinstance(a, str):
        warn_internal_id(a, where, rep)
        return a
    if not isinstance(a, dict):
        rep.err(f"{where}: artifact must be a string or {{\"label\", \"media\"}} object")
        return a
    check_keys(a, ARTIFACT_OBJ_KEYS, where, rep)
    label = a.get("label") or a.get("name")
    if not label:
        rep.warn(f"{where}: artifact object has no label")
    else:
        warn_internal_id(str(label), where, rep)
    media = a.get("media")
    if media:
        if not isinstance(media, str):
            rep.err(f"{where}: \"media\" must be a path string relative to the JSON file")
        elif a.get("mediaDataUrl"):
            pass  # already inlined
        else:
            p = pathlib.Path(media)
            p = p if p.is_absolute() else cfg_dir / p
            if not p.is_file():
                rep.err(f"{where}: media file not found: {p}")
            else:
                data_url = inline_media_file(p, where, rep)
                if data_url:
                    a["mediaDataUrl"] = data_url
    return a


def inline_artifacts(cfg, cfg_dir, rep):
    """Inline step artifact media and warn on cryptic artifact/handoff/edge labels."""
    for i, s in enumerate(as_list(cfg.get("steps"))):
        if not isinstance(s, dict):
            continue
        sid = s.get("id") or f"step{i + 1}"
        where = f'step "{sid}"'
        if "artifact" in s and s["artifact"] is not None:
            s["artifact"] = process_artifact_value(s["artifact"], f"{where} artifact", cfg_dir, rep)
        if "artifacts" in s and s["artifacts"] is not None:
            if not isinstance(s["artifacts"], list):
                rep.err(f"{where}: \"artifacts\" must be a list")
            else:
                s["artifacts"] = [
                    process_artifact_value(a, f"{where} artifacts[{j}]", cfg_dir, rep)
                    for j, a in enumerate(s["artifacts"])
                ]
        for j, hnd in enumerate(as_list(s.get("handoffs"))):
            if isinstance(hnd, dict) and hnd.get("label") is not None:
                warn_internal_id(str(hnd["label"]), f"{where} handoffs[{j}]", rep)
        if s.get("handoffLabel") is not None:
            warn_internal_id(str(s["handoffLabel"]), f"{where} handoffLabel", rep)
    for i, e in enumerate(as_list(cfg.get("edges"))):
        if isinstance(e, dict) and e.get("label") is not None:
            warn_internal_id(str(e["label"]), f'edge "{e.get("id") or i}"', rep)


class Report:
    def __init__(self):
        self.errors, self.warnings = [], []

    def err(self, msg):
        self.errors.append(msg)

    def warn(self, msg):
        self.warnings.append(msg)


def check_keys(obj, allowed, where, rep):
    for k in obj:
        if k not in allowed:
            rep.warn(f"{where}: unknown field \"{k}\" (ignored; typo?)")


def is_num(v):
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def check_color(v, where, rep):
    if v is None:
        return
    if not isinstance(v, str) or not (v in PALETTE or COLOR_RE.match(v)):
        rep.err(f"{where}: color \"{v}\" must be a palette key ({', '.join(sorted(PALETTE))}) or a #hex / rgb() value")


def check_at(v, where, rep):
    if v is None:
        return
    if not (isinstance(v, list) and len(v) == 2 and all(is_num(x) for x in v) and 0 <= v[0] < v[1] <= 1):
        rep.err(f"{where}: \"at\" must be [start, end] fractions of the step with 0 <= start < end <= 1, got {v!r}")


def validate(cfg):
    rep = Report()
    if not isinstance(cfg, dict):
        rep.err("config root must be a JSON object")
        return rep
    check_keys(cfg, {"meta", "bots", "nodes", "steps", "edges", "triggers", "$schema", "_comment"}, "config", rep)
    meta = cfg.get("meta") or {}
    if not isinstance(meta, dict):
        rep.err("meta must be an object")
        meta = {}
    check_keys(meta, META_KEYS, "meta", rep)
    if not meta.get("title"):
        rep.warn("meta.title is empty (the header will say \"Wireframe flow\")")
    theme = meta.get("theme") or {}
    if theme and not isinstance(theme, dict):
        rep.err("meta.theme must be an object")
        theme = {}
    for k in ("accent", "accent2"):
        check_color(theme.get(k), f"meta.theme.{k}", rep)
    preset = theme.get("preset")
    if preset is not None and preset not in THEME_PRESETS:
        rep.err(f'meta.theme.preset "{preset}" must be one of {", ".join(sorted(THEME_PRESETS))}')
    if meta.get("timeline") not in (None, "parallel", "sequential"):
        rep.err("meta.timeline must be \"parallel\" (default) or \"sequential\"")
    if meta.get("autoplay") is not None and not isinstance(meta.get("autoplay"), bool):
        rep.err("meta.autoplay must be true or false (default false)")
    phases = []
    for p in as_list(meta.get("phases")):
        phases.append(p if isinstance(p, str) else (p.get("id") or p.get("label")))
    labels = [p.get("label") for p in as_list(meta.get("phases")) if isinstance(p, dict)]
    lane_ids = [l if isinstance(l, str) else l.get("id") for l in as_list(meta.get("lanes"))]

    # ---- actors
    actors = {}
    bots = cfg.get("bots")
    if bots is None:
        bots = []
    if not isinstance(bots, list):
        rep.err("\"bots\" must be a list (use [] when every actor is a persona, screen, or system)")
        bots = []
    nodes = cfg.get("nodes")
    if not bots and not (isinstance(nodes, list) and nodes):
        rep.err("config needs at least one actor in \"bots\" or \"nodes\"")
    for group, default_kind in (("bots", "bot"), ("nodes", "stage")):
        for i, a in enumerate(as_list(cfg.get(group))):
            where = f"{group}[{i}]"
            if not isinstance(a, dict):
                rep.err(f"{where} must be an object")
                continue
            aid = a.get("id")
            where = f"{group}[{i}] (\"{aid}\")"
            check_keys(a, ACTOR_KEYS, where, rep)
            if not aid or not isinstance(aid, str):
                rep.err(f"{group}[{i}]: missing string \"id\"")
                continue
            if aid in actors:
                rep.err(f"duplicate actor id \"{aid}\" (ids must be unique across bots and nodes)")
                continue
            kind = a.get("kind", default_kind)
            if kind not in NODE_KINDS:
                rep.err(f"{where}: unknown kind \"{kind}\" (use one of {', '.join(sorted(NODE_KINDS))})")
            if group == "bots" and kind not in ("bot", "agent", "group", "groupchat"):
                rep.warn(f"{where}: kind \"{kind}\" inside \"bots\" — non-bot actors normally go in \"nodes\"")
            check_color(a.get("color"), where, rep)
            av = a.get("avatar")
            if av not in (None, False) and not (isinstance(av, str) and av.startswith("data:image/")):
                rep.err(f"{where}: \"avatar\" must be an image file path (inlined by build.py), a data:image/… URI, or false")
            if "avatarOverride" in a and not isinstance(a["avatarOverride"], bool):
                rep.err(f"{where}: \"avatarOverride\" must be true or false")
            is_group = kind in ("group", "groupchat") or a.get("groupChat") is True
            if "groupChat" in a and not isinstance(a["groupChat"], bool):
                rep.err(f"{where}: \"groupChat\" must be true or false")
            if a.get("members") is not None:
                if not is_group:
                    rep.warn(f"{where}: \"members\" only applies to group chats (kind \"group\" or \"groupChat\": true)")
                if not isinstance(a["members"], list):
                    rep.err(f"{where}: \"members\" must be a list of actor ids or {{agentId,name,shape,color}} objects")
                else:
                    for j, m in enumerate(a["members"]):
                        mw = f"{where}.members[{j}]"
                        if isinstance(m, str):
                            continue  # actor id, checked below
                        if not isinstance(m, dict):
                            rep.err(f"{mw}: must be an actor id or an object")
                            continue
                        check_keys(m, {"id", "agentId", "name", "shape", "color", "avatar"}, mw, rep)
                        check_color(m.get("color"), mw, rep)
                        if m.get("shape") is not None and m["shape"] not in SHAPES:
                            rep.err(f"{mw}: shape \"{m['shape']}\" is not a known shape")
            if is_group and a.get("shape") is not None:
                rep.warn(f"{where}: group chats are drawn as a group-chat tile; \"shape\" is ignored")
            if a.get("shape") is not None and a.get("shape") not in SHAPES:
                rep.err(f"{where}: shape \"{a['shape']}\" is not a known shape ({', '.join(sorted(SHAPES))})")
            if a.get("mood") is not None and a.get("mood") not in MOODS:
                rep.err(f"{where}: mood \"{a['mood']}\" must be one of {', '.join(sorted(MOODS))}")
            for k in ("col", "row", "x", "y", "dx", "dy", "w", "h"):
                if k in a and a[k] is not None and not is_num(a[k]):
                    rep.err(f"{where}: \"{k}\" must be a number")
            lane = first_present(a, "lane", "group")
            if lane is not None and lane_ids and lane not in lane_ids:
                rep.warn(f"{where}: lane \"{lane}\" is not declared in meta.lanes (it will be appended as a new lane)")
            if not a.get("name"):
                rep.warn(f"{where}: no \"name\" — the id will be shown")
            actors[aid] = a
    for aid, a in actors.items():
        for m in a.get("members") or []:
            ref = m if isinstance(m, str) else (m.get("id") if isinstance(m, dict) else None)
            if ref is not None and ref not in actors:
                rep.err(f"actor \"{aid}\": members references unknown actor \"{ref}\"")
        for l in as_list(a.get("links")):
            if l not in actors:
                rep.err(f"actor \"{aid}\": links references unknown actor \"{l}\"")
    if len([a for a in bots if isinstance(a, dict)]) > 15:
        rep.warn(f"{len(bots)} bots — layouts are tuned for 2–15; consider lanes or maxColumns")

    # ---- steps
    steps = {}
    order = []
    raw_steps = cfg.get("steps")
    if not isinstance(raw_steps, list) or not raw_steps:
        rep.err("\"steps\" must be a non-empty list")
        raw_steps = raw_steps if isinstance(raw_steps, list) else []
    for i, s in enumerate(raw_steps):
        if not isinstance(s, dict):
            rep.err(f"steps[{i}] must be an object")
            continue
        sid = str(s.get("id") or f"step{i + 1}")
        where = f"step \"{sid}\""
        check_keys(s, STEP_KEYS, where, rep)
        if sid in steps:
            rep.err(f"duplicate step id \"{sid}\"")
            continue
        if sid in actors:
            rep.err(f"step id \"{sid}\" collides with an actor id (edges can reference either, so ids must be unique)")
        by = [str(x) for x in as_list(first_present(s, "by", "bots", "bot", "actor", "actors"))]
        if not by:
            rep.err(f"{where}: missing \"by\" (the bot/actor that performs the step)")
        for b in by:
            if b not in actors:
                rep.err(f"{where}: unknown actor \"{b}\" in \"by\"")
        for t in as_list(s.get("to")):
            if t not in actors:
                rep.err(f"{where}: unknown actor \"{t}\" in \"to\"")
        if not (s.get("title") or s.get("label")):
            rep.warn(f"{where}: no \"title\"")
        dur = s.get("duration")
        if dur is not None and (not is_num(dur) or dur < 800):
            rep.err(f"{where}: duration must be a number of milliseconds >= 800")
        if s.get("kind") is not None and s["kind"] not in EDGE_KINDS:
            rep.err(f"{where}: kind \"{s['kind']}\" must be one of {', '.join(sorted(EDGE_KINDS))}")
        if s.get("mood") is not None and s["mood"] not in MOODS:
            rep.err(f"{where}: mood \"{s['mood']}\" must be one of {', '.join(sorted(MOODS))}")
        ph = s.get("phase")
        if ph is not None:
            if is_num(ph):
                if not phases or not (0 <= ph < len(phases)):
                    rep.err(f"{where}: phase index {ph} out of range (meta.phases has {len(phases)} entries)")
            elif ph not in phases and ph not in labels:
                rep.err(f"{where}: unknown phase \"{ph}\" (declare it in meta.phases)")
        for k in ("status",):
            st = s.get(k) or {}
            if not isinstance(st, dict):
                rep.err(f"{where}: status must be an object {{actorId: text}}")
                continue
            for a in st:
                if a not in actors:
                    rep.err(f"{where}: status references unknown actor \"{a}\"")
        for f in as_list(s.get("focus")):
            if f not in actors:
                rep.err(f"{where}: focus references unknown actor \"{f}\"")
        if s.get("artifactAt") is not None and s["artifactAt"] not in actors:
            rep.err(f"{where}: artifactAt references unknown actor \"{s['artifactAt']}\"")
        for j, x in enumerate(as_list(s.get("say"))):
            if isinstance(x, str):
                continue
            if not isinstance(x, dict) or "text" not in x:
                rep.err(f"{where}: say[{j}] must be a string or {{\"text\": ..., \"who\": ...}}")
                continue
            check_keys(x, SAY_KEYS, f"{where} say[{j}]", rep)
            if x.get("who") is not None and x["who"] not in actors:
                rep.err(f"{where}: say[{j}].who references unknown actor \"{x['who']}\"")
            check_at(x.get("at"), f"{where} say[{j}]", rep)
            if x.get("mood") is not None and x["mood"] not in MOODS:
                rep.err(f"{where}: say[{j}].mood \"{x['mood']}\" is not a valid mood")
        w = s.get("waiting")
        if isinstance(w, dict):
            for n in as_list(w.get("nodes")):
                if n not in actors:
                    rep.err(f"{where}: waiting.nodes references unknown actor \"{n}\"")
        elif w is not None and not isinstance(w, (bool, str)):
            rep.err(f"{where}: waiting must be true, a label string, or {{label, nodes}}")
        steps[sid] = s
        s["_id"], s["_by"] = sid, by
        order.append(sid)

    finales = [sid for sid in order if steps[sid].get("finale")]
    if len(finales) > 1:
        rep.warn(f"more than one finale step ({', '.join(finales)}); each gets its own closing beat")
    if len(order) > 40:
        rep.warn(f"{len(order)} steps — tuned for 3–40; the step-chip bar will scroll")

    # ---- edges
    edge_ids = {}
    deps = {sid: set() for sid in order}
    explicit = {sid: ("after" in steps[sid] or "dependsOn" in steps[sid]) for sid in order}
    for sid in order:
        for d in as_list(first_present(steps[sid], "after", "dependsOn")):
            if d not in steps:
                rep.err(f"step \"{sid}\": \"after\" references unknown step \"{d}\"")
            else:
                deps[sid].add(d)
    for i, e in enumerate(as_list(cfg.get("edges"))):
        if not isinstance(e, dict):
            rep.err(f"edges[{i}] must be an object")
            continue
        eid = str(e.get("id") or f"e{i + 1}")
        where = f"edge \"{eid}\""
        check_keys(e, EDGE_KEYS, where, rep)
        if eid in edge_ids:
            rep.err(f"duplicate edge id \"{eid}\"")
            continue
        f, t = e.get("from"), e.get("to")
        ft = "actor" if f in actors else "step" if f in steps else None
        tt = "actor" if t in actors else "step" if t in steps else None
        if not ft:
            rep.err(f"{where}: unknown \"from\" id \"{f}\" (not a bot/node id or a step id)")
        if not tt:
            rep.err(f"{where}: unknown \"to\" id \"{t}\" (not a bot/node id or a step id)")
        if e.get("kind") is not None and e["kind"] not in EDGE_KINDS:
            rep.err(f"{where}: kind \"{e['kind']}\" must be one of {', '.join(sorted(EDGE_KINDS))}")
        if e.get("route") is not None and e["route"] not in ROUTES:
            rep.err(f"{where}: route \"{e['route']}\" must be one of {', '.join(sorted(ROUTES))}")
        if any(e.get(k) is not None for k in ("labelAt", "labelDx", "labelDy")):
            rep.warn(f"{where}: labelAt / labelDx / labelDy are ignored; edge labels are always centered mid-path")
        if f == t and f is not None:
            rep.err(f"{where}: self-edge {f} → {t} is not supported")
        if e.get("loop") and not (ft == "step" and tt == "step"):
            rep.warn(f"{where}: \"loop\" only has meaning on step → step edges")
        if ft == "step" and tt == "step" and not e.get("loop"):
            deps[t].add(f)
            explicit[t] = True
        edge_ids[eid] = (ft, tt, e)
    actor_edges = {eid for eid, (ft, tt, _) in edge_ids.items() if ft == "actor" and tt == "actor"}

    # handoffs + step edge refs (need edge ids)
    for sid in order:
        s = steps[sid]
        hs = s.get("handoffs")
        if hs is not None and not isinstance(hs, list):
            rep.err(f"step \"{sid}\": handoffs must be a list")
            hs = []
        for j, hnd in enumerate(hs or []):
            where = f"step \"{sid}\" handoffs[{j}]"
            if not isinstance(hnd, dict):
                rep.err(f"{where} must be an object")
                continue
            check_keys(hnd, HANDOFF_KEYS, where, rep)
            if hnd.get("edge") is not None:
                if hnd["edge"] not in actor_edges:
                    rep.err(f"{where}: edge \"{hnd['edge']}\" is not a declared bot/node → bot/node edge")
            else:
                if hnd.get("to") is None:
                    rep.err(f"{where}: needs \"edge\" or \"to\"")
                elif hnd["to"] not in actors:
                    rep.err(f"{where}: unknown actor \"{hnd['to']}\" in \"to\"")
                if hnd.get("from") is not None and hnd["from"] not in actors:
                    rep.err(f"{where}: unknown actor \"{hnd['from']}\" in \"from\"")
                if (hnd.get("from") or (s["_by"][0] if s["_by"] else None)) == hnd.get("to"):
                    rep.warn(f"{where}: handoff from an actor to itself is skipped")
            check_at(hnd.get("at"), where, rep)
            check_color(hnd.get("color"), where, rep)
            if hnd.get("kind") is not None and hnd["kind"] not in EDGE_KINDS:
                rep.err(f"{where}: kind \"{hnd['kind']}\" is not a valid edge kind")
        for eid in as_list(s.get("edges")):
            if eid not in actor_edges:
                rep.err(f"step \"{sid}\": \"edges\" references \"{eid}\", which is not a declared bot/node → bot/node edge")

    # ---- triggers
    trig_ids = set()
    for i, tr in enumerate(as_list(cfg.get("triggers"))):
        if not isinstance(tr, dict):
            rep.err(f"triggers[{i}] must be an object")
            continue
        tid = str(tr.get("id") or f"trigger{i + 1}")
        check_keys(tr, TRIGGER_KEYS, f"trigger \"{tid}\"", rep)
        if tid in trig_ids:
            rep.err(f"duplicate trigger id \"{tid}\"")
        trig_ids.add(tid)
        if tr.get("edge") is not None and tr["edge"] not in actor_edges:
            rep.err(f"trigger \"{tid}\": edge \"{tr['edge']}\" is not a declared bot/node → bot/node edge")
        if tr.get("near") is not None and tr["near"] not in actors:
            rep.err(f"trigger \"{tid}\": near references unknown actor \"{tr['near']}\"")
    for sid in order:
        for x in as_list(first_present(steps[sid], "trigger", "triggers")):
            if isinstance(x, dict):
                if not (x.get("id") or x.get("label")):
                    rep.err(f"step \"{sid}\": trigger objects need an \"id\" or \"label\"")
                check_at(x.get("at"), f"step \"{sid}\" trigger", rep)
            elif not isinstance(x, str):
                rep.err(f"step \"{sid}\": trigger must be a trigger id / label string or {{id, at}}")

    # ---- dependency graph: default = previous step; finale depends on everything
    for idx, sid in enumerate(order):
        if not explicit[sid] and idx > 0:
            deps[sid].add(order[idx - 1])
    for sid in finales:
        deps[sid] = {x for x in order if x not in finales}
    state, stack, cycles = {}, [], []

    def visit(n):
        if state.get(n) == 2:
            return
        if state.get(n) == 1:
            cycles.append(stack[stack.index(n):] + [n])
            return
        state[n] = 1
        stack.append(n)
        for d in sorted(deps.get(n, ())):
            visit(d)
        stack.pop()
        state[n] = 2

    sys.setrecursionlimit(10000)
    for sid in order:
        visit(sid)
    for c in cycles[:5]:
        rep.err("dependency cycle between steps: " + " → ".join(reversed(c)) +
                " (to draw a feedback loop, mark the back edge with \"loop\": true)")
    # actors never used anywhere
    used = set()
    for sid in order:
        s = steps[sid]
        used.update(s["_by"], as_list(s.get("to")), as_list(s.get("focus")), (s.get("status") or {}).keys())
        for hnd in as_list(s.get("handoffs")):
            if isinstance(hnd, dict):
                used.update([hnd.get("from"), hnd.get("to")])
                if hnd.get("edge") in edge_ids:
                    used.update([edge_ids[hnd["edge"]][2].get("from"), edge_ids[hnd["edge"]][2].get("to")])
        for x in as_list(s.get("say")):
            if isinstance(x, dict):
                used.add(x.get("who"))
    for eid, (ft, tt, e) in edge_ids.items():
        used.update([e.get("from"), e.get("to")])
    for aid in actors:
        if aid not in used:
            rep.warn(f"actor \"{aid}\" is never used by a step or edge (it will still be drawn)")
    for s in steps.values():
        s.pop("_id", None)
        s.pop("_by", None)
    return rep


# ---------------------------------------------------------------- real-fleet avatars
def apply_fleet(cfg, cfg_dir, fleet_dir, use_fleet, rep, notes):
    """Ignore agentId / agentName. This playbook does not load external profiles."""
    fleet = FLEET.load_fleet(fleet_dir) if (FLEET and use_fleet) else []
    seen_ids = {}
    for group in ("bots", "nodes"):
        for i, a in enumerate(as_list(cfg.get(group))):
            if not isinstance(a, dict):
                continue
            where = f'{group}[{i}] ("{a.get("id")}")'
            # an explicit picture file → inline data URI
            av = a.get("avatar")
            if isinstance(av, str) and av and not av.startswith("data:"):
                if not FLEET:
                    rep.err(f"{where}: avatar file paths are not inlined here; omit avatar or use a data:image URI")
                    continue
                p = pathlib.Path(av)
                p = p if p.is_absolute() else cfg_dir / p
                try:
                    a["avatar"], size = FLEET.picture_data_uri(p)
                    if size > 400_000:
                        rep.warn(f"{where}: avatar picture is {size // 1024} KB (it is inlined; consider a smaller image)")
                except (OSError, ValueError) as e:
                    rep.err(f"{where}: avatar file {p}: {e}")
            is_bot = a.get("kind", "bot" if group == "bots" else "stage") in ("bot", "agent", "group", "groupchat")
            aid, aname = a.get("agentId"), a.get("agentName")
            if not (aid or aname):
                continue
            if not is_bot:
                rep.warn(f"{where}: agentId/agentName are ignored")
                continue
            override = a.get("avatarOverride") is True
            if not fleet:
                why = "fleet lookup disabled (--no-fleet)" if not use_fleet else f"no agent profiles under {fleet_dir}"
                if aid and FLEET:
                    sh, co, _, _ = FLEET.resolve_mark(str(aid))
                    if not (override and a.get("shape")):
                        a["shape"] = sh
                    if not (override and a.get("color")):
                        a["color"] = co
                    rep.warn(f"{where}: {why}; using the app's id-derived default look {a['shape']}/{a['color']}, "
                             f"which is only right if this bot's profile has no explicit avatar shape/color")
                else:
                    rep.warn(f"{where}: {why}; cannot resolve \"{aname or aid}\" — the bot keeps its config/auto look")
                continue
            ent, problem = FLEET.match(fleet, agent_id=aid, agent_name=aname)
            if problem:
                rep.warn(f"{where}: {problem}")
            if not ent:
                if aid:
                    sh, co, _, _ = FLEET.resolve_mark(str(aid))
                    if not (override and a.get("shape")):
                        a["shape"] = sh
                    if not (override and a.get("color")):
                        a["color"] = co
                    rep.warn(f"{where}: rendering the app's id-derived default {a['shape']}/{a['color']} for unknown agent {aid}")
                continue
            if ent["isGroup"] and not (override and a.get("groupChat") is False):
                # group chat (group.json on disk): room tile with the members' real marks, never the hashed bot look
                if a.get("kind") not in ("group", "groupchat"):
                    a["groupChat"] = True
                for k in ("shape", "color"):
                    if k in a and not override:
                        rep.warn(f'{where}: "{k}" ignored — "{ent["name"]}" is a group chat (drawn with the group chat icon)')
                        a.pop(k)
                a.pop("shape", None)
                a["agentId"] = ent["id"]
                if not a.get("name"):
                    a["name"] = ent["name"]
                if not a.get("description") and ent["description"]:
                    a["description"] = FLEET.first_para(ent["description"])
                if "members" not in a:
                    a["members"] = FLEET.group_members(fleet, ent)
                    for m in a["members"]:
                        if "name" not in m:
                            rep.warn(f'{where}: group member {m["agentId"]} has no profile on disk (drawn with its id-derived default)')
                names = [m.get("name") or m.get("agentId", "?")[:8] for m in a["members"] if isinstance(m, dict)] or [str(m) for m in a["members"]]
                notes.append(f'fleet: {a.get("id")} = {ent["name"]} [{ent["id"][:8]}] → group chat icon '
                             f'({len(a["members"])} members: {", ".join(names) if names else "none listed — generic dots"})')
                if ent["id"] in seen_ids:
                    rep.warn(f'{where}: agent "{ent["name"]}" is also used by {seen_ids[ent["id"]]}')
                seen_ids[ent["id"]] = where
                continue
            if ent["id"] in seen_ids:
                rep.warn(f'{where}: agent "{ent["name"]}" is also used by {seen_ids[ent["id"]]}')
            seen_ids[ent["id"]] = where
            a["agentId"] = ent["id"]
            for key, val in (("shape", ent["shape"]), ("color", ent["color"])):
                cur = a.get(key)
                if override and cur:
                    continue
                if cur and cur != val:
                    rep.warn(f'{where}: {key} "{cur}" replaced by the real bot\'s {key} "{val}" '
                             f'(set "avatarOverride": true to keep yours)')
                a[key] = val
            pic = None
            if ent["picture"] and not (override and "avatar" in a):
                try:
                    a["avatar"], size = FLEET.picture_data_uri(ent["picture"])
                    pic = ent["picture"]
                    if size > 400_000:
                        rep.warn(f'{where}: profile picture {pic} is {size // 1024} KB (inlined as-is)')
                except (OSError, ValueError) as e:
                    rep.warn(f"{where}: could not read profile picture {ent['picture']}: {e}")
            if not a.get("name"):
                a["name"] = ent["name"]
            if not a.get("description") and ent["description"]:
                a["description"] = FLEET.first_para(ent["description"])
            src = ("profile" if ent["shapeSource"] == ent["colorSource"] == "profile" else
                   "app default derived from agent id (profile avatar fields are empty)" if ent["shapeSource"] == ent["colorSource"] == "app-default"
                   else f'shape: {ent["shapeSource"]}, color: {ent["colorSource"]}')
            shown = f'{a.get("shape")}/{a.get("color")}' + (" (author override)" if override and (a.get("shape") != ent["shape"] or a.get("color") != ent["color"]) else "")
            notes.append(f'fleet: {a.get("id")} = {ent["name"]} [{ent["id"][:8]}] → {shown} — {src}'
                         + (f"; custom picture {pic}" if pic else "; no custom picture on disk"))


def build(cfg, template_text):
    data = json.dumps(cfg, indent=1, ensure_ascii=False).replace("<", "\\u003c")
    pat = re.compile(r"<!--FLOW-CONFIG-START-->.*?<!--FLOW-CONFIG-END-->", re.S)
    if not pat.search(template_text):
        raise SystemExit("template is missing the <!--FLOW-CONFIG-START--> … <!--FLOW-CONFIG-END--> markers")
    block = ('<!--FLOW-CONFIG-START--><script type="application/json" id="flow-config">\n' + data +
             '\n</script><!--FLOW-CONFIG-END-->')
    out = pat.sub(lambda m: block, template_text, count=1)
    meta = cfg.get("meta") or {}
    title = meta.get("pageTitle") or ((meta.get("title") or "Wireframe flow") + (" — " + meta["tagline"] if meta.get("tagline") else ""))
    out = re.sub(r"<title>.*?</title>", lambda m: "<title>" + html.escape(title) + "</title>", out, count=1, flags=re.S)
    return out


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("config", nargs="?", help="flow config JSON (see SCHEMA.md)")
    ap.add_argument("-o", "--out", help="output HTML path (default: <config>.html next to the config)")
    ap.add_argument("--template", default=str(HERE / "template.html"), help="template path (default: template.html beside build.py)")
    ap.add_argument("--check", action="store_true", help="validate only, don't write")
    ap.add_argument("--strict", action="store_true", help="treat warnings as errors")
    a = ap.parse_args(argv)
    if not a.config:
        ap.error("config is required")
    cfg_path = pathlib.Path(a.config)
    try:
        cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"error: config not found: {cfg_path}", file=sys.stderr)
        return 1
    except json.JSONDecodeError as e:
        print(f"error: {cfg_path} is not valid JSON: line {e.lineno} col {e.colno}: {e.msg}", file=sys.stderr)
        return 1
    notes = []
    pre = Report()
    if isinstance(cfg, dict):
        apply_fleet(cfg, cfg_path.resolve().parent, None, False, pre, notes)
        inline_artifacts(cfg, cfg_path.resolve().parent, pre)
    rep = validate(cfg)
    rep.errors[:0] = pre.errors
    rep.warnings[:0] = pre.warnings
    for n in notes:
        print(n)
    for w in rep.warnings:
        print(f"warning: {w}", file=sys.stderr)
    for e in rep.errors:
        print(f"error: {e}", file=sys.stderr)
    if rep.errors or (a.strict and rep.warnings):
        print(f"\n{len(rep.errors)} error(s), {len(rep.warnings)} warning(s) — not built.", file=sys.stderr)
        return 1
    n_bots = len(as_list(cfg.get("bots")))
    n_nodes = len(as_list(cfg.get("nodes")))
    n_steps = len(as_list(cfg.get("steps")))
    if a.check:
        print(f"ok: {cfg_path} — {n_bots} bots, {n_nodes} other nodes, {n_steps} steps, {len(rep.warnings)} warning(s)")
        return 0
    tpl = pathlib.Path(a.template).read_text(encoding="utf-8")
    out_path = pathlib.Path(a.out) if a.out else cfg_path.with_suffix(".html")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(build(cfg, tpl), encoding="utf-8")
    print(f"built {out_path} — {n_bots} bots, {n_nodes} other nodes, {n_steps} steps, {len(rep.warnings)} warning(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
