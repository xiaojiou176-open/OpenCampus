# Web Workbench Override

## Purpose

这页是桌面版主控台，不是 importer demo，也不是 AI playground。

## Override Rules

1. 第一屏固定为：
   - orientation card
   - `Focus Queue`
   - `Weekly Load`
2. hero 右侧只放 `Workspace truth`
3. toolbar 分两组：
   - `Load / Import`
   - `Filter / Export`
4. `Imported site counts` 下沉成 supporting evidence，不和主决策卡同级
5. 空状态必须给出动作，例如 `Import a current-view snapshot first`

## Copy Rules

- 主句：`One local workspace for what changed, what is open, and what needs attention first.`
- 不要把 `standalone second surface` 放在主句里

## A11y

- 必须有 `Skip to workbench content`
- toolbar 顺序必须可 Tab 浏览
- hero / metrics / panels 之间要有清晰 heading 层级
