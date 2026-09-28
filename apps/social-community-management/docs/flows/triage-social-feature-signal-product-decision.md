# Flow: Triage social feature signal → product decision

## Personas (session role switcher)

- EXAMPLE — Community Manager
- EXAMPLE — Infrastructure scout / DevOps analyzer
- EXAMPLE — Product Manager

## Success criterion

CM routes a post with evidence; Scout adds correlation; PM records accept / defer / reject with a fan-facing reason; closed view shows decision + evidence timeline (mock only).

## Entry

`/posts/:id` (primary demo entry; list at `/signals`)

## Steps

1. Post detail — quote, channel, sentiment, thread snippets
2. CM — feature request vs dismiss as noise
3. CM — intake (title, summary, duplicate hint)
4. Scout — correlation panel, link mock incident, related / not related / resolved
5. CM or Scout — submit to product decision queue
6. PM — accept / defer / reject + fan-facing reason
7. Closed — timeline (post, intake, correlation, decision)

## Edge states

- Already routed / duplicate — warn + link to open request
- Dismiss as noise — session dismiss; **Dismissed (noise)** list filter
- No internal signals — empty suggested list + scout can pick any signal or none
- Conflicting signals — resolved downtime + ongoing errors on login-timeout post
- Empty PM queue — `/decisions` when nothing is `submitted`

## Routes

| Route | Screen |
| --- | --- |
| `/signals` | Filterable post list |
| `/posts/:id` | Triage, intake, correlation, submit |
| `/decisions` | PM queue |
| `/decisions/:id` | Evidence + PM form + closed timeline |

## Mocks

- `src/assets/mock/posts.json`
- `src/assets/mock/internal-signals.json`
- `src/assets/mock/requests.json`

## Out of scope (this flow)

Live X / Jira / Teams; Jira create/assign; bulk triage as primary entry; public fan roadmap; bug-only separate journey.
