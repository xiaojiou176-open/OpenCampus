# Extension Sidepanel Override

## Purpose

这是默认随页 companion，不再是完整工作台的第一视口。

## Override Rules

1. 顶栏必须先给：
   - brand / current site context
   - `Assistant / Export / Settings` mode switcher
   - language / connection status
2. 第一屏只保留轻 companion 结构：
   - current context
   - local connection / trust cue
   - `Light companion mode` CTA card
3. `Ask AI` 保持 explanation layer，但在默认模式里提前到主区
4. 完整 workbench 要移到 `Show detailed workspace` 折叠层之后
5. AI 面板内 provider/model controls 下沉到 `Advanced runtime settings`

## Copy Rules

- 保留“不是空聊天框”的防漂逻辑
- 但语气要像一个可信 companion，不像开发者解释器

## State Rules

- `Trust Summary` 用 segmented chips 或 status strip
- `blocked` 必须同时给出 manual route
- 默认模式第一屏不依赖滚动
