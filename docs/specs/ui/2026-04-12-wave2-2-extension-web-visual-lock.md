# Campus Copilot Wave 2.2 Design Audit + Implementation-Ready Visual Lock

日期：2026-04-12  
状态：`implementation-ready / designer-lock`  
作者角色：`Wave 2.2 Designer`  
范围：`apps/extension`、`apps/web` 当前 extension/web 表层  
不在本稿内：生产代码实现、API/Schema 变更、权限扩张、站外写能力、README/public-surface 文案

---

## 1. Design Classification

- `task_type`: `design-audit + handoff-spec`
- `primary_surfaces`:
  - `extension sidepanel`
  - `extension popup`
  - `extension options`
  - `extension Ask AI`
  - `web workbench`
  - `web support rail`
  - `web AI panel`
- `comparison_basis`:
  - repo contracts: `.stitch/DESIGN.md`, `design-system/MASTER.md`, page overrides
  - donor contracts: Notion primary, Claude warmth only, Raycast shell only
  - current implementation: extension/web surface source and styles
  - runtime evidence: web first-fold screenshot, extension smoke, web interaction drift failure

### Final verdict

一句话先讲清楚：

> **Campus Copilot 现在的结构方向已经基本对了，但视觉语言还没有 100% 服从 donor order。**
> `extension` 已经更像 companion，`web` 也已经不是 generic chat shell，但两端都还残留明显的 `teal/orange SaaS dashboard` 语气，尤其 `web` 首屏仍然太像“hero + toolbar 先行”，还不够像一个坐下来就开始判断的学业工作台。

### Anti-slop verdict

- `extension`: `mostly on track, still visually over-bright`
- `web`: `structurally improved, still hero-heavy and too airy above the decision lane`
- `shared system`: `contract exists, implementation tokens still drift`

---

## 2. Evidence Base

### Confirmed evidence

- `design-system/MASTER.md` 明确了：
  - `Notion primary`
  - `Claude warmth only`
  - `Raycast shell only`
  - `no full-product teal/orange SaaS atmosphere`
- `.stitch/DESIGN.md` 明确了：
  - warm-neutral paper background
  - `Campus Green + Copper Signal`
  - AI 只是 explanation rail
  - extension/web 同家族但不同密度
- `design-system/pages/*.md` 明确了页面级 override：
  - sidepanel 第一屏只保留 companion 结构
  - popup 必须 launcher-first
  - options 必须 summary-first trust center
  - web 第一屏必须是 orientation + focus queue + weekly load，不是工具台或营销 hero
- `apps/extension/tests/extension.smoke.spec.ts` fresh pass，证明：
  - sidepanel 默认是 assistant-first
  - popup 仍保持 launcher-first
  - options 已有 trust-center 倾向
  - Ask AI 里 evidence/citation 结构存在
- `apps/web` fresh screenshot 证明：
  - 当前 web 首屏仍由大 hero + toolbar 占据主要注意力
  - trust rail 和 AI rail 没有在第一视觉层里形成真正的工作台主叙事
- `apps/web/tests/web.smoke.spec.ts` fresh fail，说明：
  - 现有 `web` 在 heading / story order 上已经漂离旧 smoke 假设
  - 这是 current truth 与旧验证口径的 drift，不是设计已经 fully locked 的证据

### Evidence confidence

- `extension visual judgment`: `high`
  - 原因：源码结构清楚，smoke 测试覆盖默认视图和 mode 切换
- `web visual judgment`: `high`
  - 原因：源码结构清楚，已拿到真实首屏截图
- `pixel-perfect claims`: `not claimed`
  - 原因：本轮没有 Figma 源文件，也没有对所有断点逐一截图

---

## 3. Thin Slice

本轮不是全站 redesign，也不是新风格探索。

本轮只锁 6 件事：

1. `extension` 第一屏应该先让人看到什么
2. `web` 第一屏应该先让人看到什么
3. 两端共用哪一套 token / typography / spacing / panel hierarchy
4. trust / blockers / next step 在视觉上怎样排优先级
5. 哪些是本 wave 必修，哪些是 final polish 再做
6. implementer 哪些地方不能再自由发挥

### Thin-slice non-goals

- 不重做数据模型
- 不重写文案体系
- 不新增公共 design token 体系之外的第四套皮肤
- 不把 web 变成 landing page
- 不把 extension 变成 mini dashboard
- 不把任何 surface 变成聊天页

---

## 4. Aesthetic Lock

### Locked direction

- **主方向**：`Notion primary`
  - 负责布局节奏、卡片关系、边框、留白、纸面感
- **次方向**：`Claude warmth only`
  - 只给 AI explanation lane 和 trust copy 一点人味与温度
- **次方向**：`Raycast shell only`
  - 只给 extension chrome、launcher 节奏、紧凑切换器

### Hard interpretation

- `extension` 应该像：
  - 一个跟着当前页面走的安静 companion
  - 不是缩小版 full workbench
- `web` 应该像：
  - 坐下来核对、判断、导出的一张学业桌面
  - 不是 marketing hero
  - 不是 AI playground
- `AI lane` 应该像：
  - 解释轨道
  - 不是产品主角

### Explicitly banned

- dark-first cyberpunk
- fintech/ops dashboard 气质
- 满屏 teal/orange 发光洗版
- Claude-style chat page 作为主壳
- Raycast/Linear developer console 气质
- equal-weight card wall

---

## 5. Shared Design Contract

这一节是 implementer 的统一视觉合同。

### 5.1 Tokens

#### Locked palette

必须往下面这组角色回收，不再继续围绕明亮 teal/orange 做大面积背景氛围：

| Role | Locked token | Intent |
| :-- | :-- | :-- |
| Page background | `#F5F4EE` | paper canvas |
| Main surface | `#FBFAF6` | ivory surface |
| Muted surface | `#F1EEE5` | supporting groups |
| Primary text | `#27483D` | pine ink |
| Secondary text | `#4E665E` | slate moss |
| Border | `#DCE8E1` | whisper structure |
| Primary action / trust ready | `#1F5D4B` | campus green |
| Single accent / export highlight | `#A8622A` | copper signal |
| Warning | `#B36B2C` | soft warning |
| Danger | `#A14343` | quiet danger |

#### Token rule

- 绿色负责 trust / ready / active
- 铜色只给真正主要动作或 step emphasis
- danger/warning 必须是 honest status，不是戏剧效果
- 不准用满屏 radial-gradient 把品牌语气重新拉回旧 SaaS dashboard

### 5.2 Typography

#### Locked font stack

- `Geist, "Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif`

#### Hierarchy lock

| Role | Extension | Web |
| :-- | :-- | :-- |
| H1 | `28-30px / 700` | `40-48px / 700` |
| Section title | `16-18px / 600` | `18-20px / 600` |
| Lead | `15-16px / 500` | `17-18px / 500` |
| Body | `14-15px / 400` | `15-16px / 400` |
| Meta | `12-13px / 500` | `12-14px / 500` |
| Mono/meta receipts | `12-13px` mono only when needed | same |

#### Typography rules

- web H1 必须更像 workbench title，不像 campaign headline
- extension H1 必须更像 context header，不像 dashboard title
- meta 和 badge 只做辅助，不准冒充 section title
- 不能再出现“标题、正文、标签都差不多粗细”的假层级

### 5.3 Spacing

| Token | Locked use |
| :-- | :-- |
| `4px` | icon-meta micro gap |
| `8px` | chip/button intra-gap |
| `12px` | small vertical grouping |
| `16px` | default card internal spacing in extension |
| `20px` | section stack gap |
| `24px` | web card padding / major panel padding |
| `32px` | large web section separation |

#### Rhythm rule

- `extension`: 紧凑但不挤，更多 `12/16/20`
- `web`: 宽松但不空，更多 `16/24/32`
- 同组内容要明显更近
- trust / blockers / next step 必须是一个逻辑组，不能被 metrics 隔开

### 5.4 Panel hierarchy

只允许三类卡片语言：

1. `orientation-card`
   - 回答：我现在在哪、现在状态怎样、下一步是什么
2. `decision-card`
   - 回答：你该先处理哪个判断对象
3. `evidence-card`
   - 回答：这个判断是基于什么事实

#### Hard rule

- 不准每个面板都自己发明第四种“特殊卡”
- 不准让 metrics 卡在视觉上和 orientation-card 抢第一

---

## 6. Extension Visual Judgment

### 6.1 Overall judgment

`extension` 的信息结构已经明显比旧版本更对：

- 默认是 `assistant`
- workbench 被折叠在后面
- popup 已经是 launcher-first
- options 已经往 trust-center 收

但视觉上还没完全 landing，主要有 4 个问题：

1. **色彩还是太亮太“teal/orange SaaS”**
2. **部分卡片仍像 equal-weight dashboard panels**
3. **companion card 还不够“安静可信”，有一点 tool shell 味**
4. **Ask AI 虽然结构正确，但 supporting rail 仍稍微重**

### 6.2 What is already right

- 第一屏已经把 detailed workspace 收到折叠区后面
- trust strip 已经被压成单行，不再是一堵 warning wall
- Ask AI 里 `What AI can see / cannot do / citations` 的结构是对的
- popup 没再把导出 preset 墙放在默认层
- settings mode 已经把完整编辑推回 options

### 6.3 What still feels off

#### P0

- 无 `P0` 级结构性失败  
  解释：extension 默认模式没有再漂成聊天页，也没有再漂成 mini dashboard。

#### P1

1. **第一屏 companion card 仍然偏亮、偏“产品宣传卡”，不够像工作 companion**
2. **trust strip 与 companion card 的色相太接近，导致 supporting block 不够退后**
3. **Ask AI sidebar/supporting cards 仍略显密和重，容易和 question card 抢第一注意力**
4. **当前 token 家族没有完全回到 paper/ivory/green/copper，导致 donor order 被旧 SaaS 颜色干扰**

#### P2

1. popup 第三块 trust summary 还可以更轻，减少“第三张卡”的感觉
2. settings mode 的三张卡还可以拉开主次，而不是近似三栏并列

### 6.4 Extension first fold lock

#### Sidepanel assistant first fold

第一屏固定是：

1. 顶栏
   - brand/context eyebrow
   - H1
   - mode switcher
   - language button
   - connection badge
   - authorization badge
2. `Companion orientation card`
   - current context
   - top blocker or next-up
   - concise readiness line
   - two CTAs only
     - primary: `Open export`
     - secondary: `Open settings`
3. `Trust strip`
   - `Read-only`
   - `Structured facts only`
   - `Manual-only red zones`
   - latest receipt summary
4. `Ask AI`
   - visible evidence
   - question
   - answer with citations

#### Sidepanel first fold must not contain

- full metric grid
- diagnostics block before companion
- full Focus Queue / Weekly Load / Change Journal
- provider/model/BFF form fields above AI question

#### Popup first fold

第一屏固定是：

1. Pulse summary
2. Quick actions
3. Lightweight trust note

不允许出现：

- export preset wall
- site status wall
- settings form

#### Options first fold

第一屏固定是：

1. connection summary
2. language + readiness summary
3. boundary / authorization headline

advanced runtime 保持在明显次级位置。

---

## 7. Web Visual Judgment

### 7.1 Overall judgment

`web` 当前最大问题不是“丑”，而是**太像一个被美化过的工具入口页**，还不够像一张已经进入工作状态的桌面。

说得更直白一点：

> 现在的 web 首屏更像“欢迎来到这个产品，我们给你一个 hero 和一套 toolbar”，  
> 但目标应该是“你已经坐到桌前，这里立刻告诉你事实、可信度、阻塞和下一步”。

### 7.2 What is already right

- trust rail 和 AI rail 已经被抬到 decision lane 之前
- web 已经不是 generic chat shell
- workbench panels 本身的信息结构是丰富的
- support rail 已经在讲 truthful trust，而不是假 KPI

### 7.3 What still feels off

#### P1

1. **hero 太高、太宽、太空，抢走了第一屏最宝贵的判断空间**
2. **toolbar 卡片在第一屏权重过大，像“操作台先行”，不是“判断台先行”**
3. **support rail 和 AI rail 虽然位置提前了，但仍被 hero 叙事压在后面**
4. **H1 “Student decision workspace” 还偏 generic product title，不够像具体 workbench**
5. **当前视觉语言仍有明显 teal/orange gradient wash，违背 design contract 的 calm desk 口径**

#### P2

1. support cards 的背景对比可以更克制
2. hero-card 里的 `Workspace truth` 语气对了，但视觉仍有“feature highlight card”味道

### 7.4 Web first fold lock

#### Desktop first fold target

在 `1440px` 桌面宽度下，第一屏必须同时让用户看到这 4 件事：

1. 这是一个 workbench，不是 landing hero
2. 当前 workspace truth / trust / blocker 在哪里
3. AI 是解释层，不是入口主角
4. `Focus Queue` 或 `Weekly Load` 至少有一个开始进入可见区

#### Locked order

1. `Orientation header`
   - left:
     - eyebrow
     - H1
     - one-sentence lead
   - right:
     - workspace truth
     - top blocker
     - next step
2. `Support + AI row`
   - trust summary card
   - diagnostics/receipts card
   - compact AI explanation summary
3. `Toolbar`
   - as supporting operations row
   - not the main story
4. `Decision workspace`
   - `Focus Queue`
   - `Weekly Load`
   - then the rest

#### Hard visual lock

- hero vertical padding must shrink
- toolbar must visually recede one level
- trust/support row must move into the first perceptual layer
- decision workspace must start earlier

### 7.5 Web must not do

- 不准继续像 marketing/product hero
- 不准让 import/export controls 比 trust summary 更显眼
- 不准让 AI panel 比 Focus Queue 更像主内容
- 不准把 web 首屏做成“欢迎页 + 下面才进入工作区”

---

## 8. Trust / Blockers / Next Step Priority

这一节是本轮最关键的视觉优先级合同。

### Locked order of importance

1. `current truth`
2. `trust status`
3. `top blocker`
4. `next action`
5. `supporting metrics`
6. `advanced controls`

### Contract-driven vs local interaction

#### Contract-driven

- `ready / partial / blocked / manual-only`
- policy envelope
- authorization level
- sync status
- current scope / export scope
- citation presence / uncited warning

#### Local interaction

- mode open/close
- advanced panel collapse
- workspace detail expand/collapse
- site filter selection
- toolbar grouping

### Visual priority rules

- blocker 必须出现在第一屏可见区域
- next step 必须和 blocker 在同一主组里
- metrics 只能作为 supporting evidence，不是第一页最大字号
- advanced runtime 只能是 disclosure，不是默认主体

---

## 9. Page / Panel-Level State Matrix

### 9.1 Shared state rules

| State | Type | Visual treatment | Placement priority |
| :-- | :-- | :-- | :-- |
| `loading` | local interaction | muted surface + skeleton/value dash | keep layout stable |
| `ready` | contract-driven | success badge + plain-language summary | first fold allowed |
| `partial` | contract-driven | warning badge + one-line explanation | first fold allowed |
| `blocked` | contract-driven | danger/warning card + manual route | first fold required |
| `manual-only` | contract-driven | danger-border note, no false CTA | first fold required when relevant |
| `uncited-answer` | contract-driven | warning tag near answer title | inside AI answer zone |
| `advanced-closed` | local interaction | collapsed disclosure | below main action layer |
| `advanced-open` | local interaction | disclosure body on muted surface | never above main truth layer |

### 9.2 Extension sidepanel

| Zone | Must show in loading | Must show in ready | Must show in blocked |
| :-- | :-- | :-- | :-- |
| top bar | mode + lang + connection placeholder | mode + lang + badges | mode + lang + blocked badge |
| companion card | current page context skeleton | current context + top next-up + readiness | current context + blocker + open settings/manual route |
| trust strip | static labels | labels + latest receipt | labels + receipt + blocker wording |
| Ask AI | disabled ask button | evidence + ask + citations | blocked reason + settings/manual route |

### 9.3 Extension popup

| Zone | Priority |
| :-- | :-- |
| pulse summary | first |
| quick actions | second |
| trust note | third |
| extra export shortcuts | hidden by default |

### 9.4 Extension options

| Zone | Priority |
| :-- | :-- |
| connection summary | first |
| provider readiness summary | first |
| authorization center | second |
| site overrides | third |
| advanced runtime | last |

### 9.5 Web

| Zone | Must show in first fold |
| :-- | :-- |
| orientation header | yes |
| workspace truth | yes |
| trust summary | yes |
| diagnostics / receipts | yes |
| compact AI explanation summary | yes |
| toolbar | yes, but subordinate |
| Focus Queue or Weekly Load start | yes |

---

## 10. Must Fix This Wave vs Can Wait Final Polish

### Must fix this wave

1. **Token realignment**
   - 把 extension/web 从当前 bright teal/orange wash 收回到 paper/ivory/green/copper 体系
2. **Web first fold reorder**
   - 压缩 hero
   - toolbar 降级
   - trust/support/AI 提前到同一视觉层
3. **Extension panel hierarchy cleanup**
   - companion card 更像 orientation card
   - trust strip 更退后
   - Ask AI supporting blocks 降噪
4. **Shared typography lock**
   - `Geist + Plus Jakarta Sans` 回到统一字体栈
   - 标题/正文/meta 层级拉开
5. **Status honesty consistency**
   - `ready / partial / blocked / manual-only / uncited` 的 badge 和文案必须完全一致
6. **Options summary-first posture**
   - connection/readiness/boundary 必须在第一屏清楚
   - provider/model/BFF 只能在 advanced

### Can wait for final polish

1. 纹理和背景微调
2. 阴影层级的细抛光
3. 动效节奏统一
4. hero/rail 圆角和边框的微米级校准
5. illustration / ornamental touches

---

## 11. Anti-Slop Red Lines

### Never do again

1. 不准把任何 surface 做成聊天主页面
2. 不准把 web 首屏做成营销 hero
3. 不准把 extension 默认层做成长滚动工作台
4. 不准把 popup 做成 mini dashboard
5. 不准把 developer/runtime 表单放到第一视口
6. 不准让 metrics 卡和 trust/blocker/next-step 同权
7. 不准继续用 full-product teal/orange gradient wash
8. 不准用高饱和 CTA 到处抢注意力
9. 不准让 AI panel 没 citation 时装成已经可信
10. 不准让 blocked 状态没有 manual route

### Family resemblance rule

- extension 与 web 必须像同一家产品
- 但不能像同一个页面缩放版

#### Same family

- 同 token
- 同文字气质
- 同 badge 语义
- 同边框和背景语言

#### Different density

- `extension`: 紧、轻、近手、少列
- `web`: 宽、稳、长阅读、允许更深层对照

---

## 12. Implementation-Ready Lock

### 12.1 Extension lock

- 保留当前三模式 IA，不再重开 mode 架构讨论
- assistant mode 第一屏固定为：
  - top bar
  - companion card
  - trust strip
  - Ask AI
- detailed workspace 继续留在 disclosure 之后
- popup 只保留 pulse + fast actions + trust note 三段
- settings mode 只做轻量 summary，不抢 options 主编辑职责

### 12.2 Web lock

- web 首屏必须是 `workbench entry`，不是 `hero entry`
- support rail 与 AI rail 进入第一感知层
- toolbar 改成 supporting operations row
- decision workspace 提前开始
- 允许更宽，但不允许更空

### 12.3 Component lock

- `orientation-card` 可以有轻背景倾斜，但不可过亮
- `decision-card` 优先 border + spacing，不用浓渐变
- `evidence-card` 必须最轻
- primary CTA 一屏最多一个
- secondary/ghost CTA 只做服务角色

### 12.4 Copy lock for local UI labels

以下属于本地 UI 语义，不算 public-surface positioning：

- web 主句优先使用 page override 里的：
  - `One local workspace for what changed, what is open, and what needs attention first.`
- AI 标题继续保持：
  - `Ask AI about this workspace`
  - `Cited AI`
- popup 继续使用：
  - `Quick pulse`
  - `Open assistant`
  - `Quick export`
  - `Settings/Auth`

---

## 13. Must Have / Must Not Have

### Must have

- first fold trust layer
- honest blocker state
- next-step visibility
- AI boundary before answer
- citation visibility near answer
- shared token language
- extension/web density distinction
- reduced visual noise in supporting cards

### Must not have

- hero-first web
- equal-weight extension card wall
- AI-first main shell
- long technical settings wall at top
- over-decorated gradients
- dark-first cyberpunk styling
- dev-console styling

---

## 14. Verification Focus

implementer 完成后，Designer / Reviewer 应只盯这几项：

1. **Web first fold**
   - 第一屏是否能同时看到 orientation + trust + AI summary + decision lane 开始
2. **Extension first fold**
   - 是否仍然是 top bar + companion + trust strip + Ask AI
3. **Token drift**
   - 是否仍有明显 teal/orange SaaS wash
4. **Panel hierarchy**
   - orientation / decision / evidence 是否清楚
5. **State honesty**
   - blocked/manual-only/uncited 是否都诚实可见
6. **Density split**
   - extension 是否更紧
   - web 是否更宽
7. **A11y**
   - visible focus
   - no color-only status
   - skip link 保留

### Suggested verification receipts

- web fresh screenshot at desktop width
- sidepanel smoke still pass
- popup smoke still pass
- options smoke still pass
- AI lane with `ready`, `blocked`, `uncited-answer` 各一张截图
- one responsive snapshot below `768px`

---

## 15. Open Questions / Pending

以下不是 blocker，但实施时要保持诚实：

- `web` H1 最终是保留 `Student decision workspace`，还是更明确地回到 `workbench` 语义，需要和当前 page override 再统一一次
- extension settings mode 与 options page 的视觉重复度还能继续下降，但这属于下一轮 polish，不是本 wave blocker
- 本轮没有逐断点截图，所以极窄高度下的 no-scroll quality 还需要一次 fresh visual pass

---

## 16. Handoff Summary

给 implementer 的一句话施工指令：

> **不要重做结构，重做的是视觉服从度。**  
> `extension` 保留现在的 companion-first 架构，把它从亮色工具卡收成 calm companion。  
> `web` 保留现在的 workbench 组成，但把 hero/toolbar 的声量压下去，让 trust + blocker + next step 真正进入第一屏主叙事。
