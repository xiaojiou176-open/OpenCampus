# Extension Sidepanel Override

## Purpose

这是最接近正式产品面的 daily workspace。

## Override Rules

1. 第一屏只保留三块主卡：
   - `Next Up`
   - `Trust Summary`
   - `Quick Actions`
2. `Today Snapshot` 降成 slim metrics row
3. `Diagnostics` 提前到第一屏之后，不要埋太深
4. `Current Tasks / Study Materials / Discussion / Notice / Schedule / Site Status / Change Journal` 统一成 evidence-card 语言
5. AI 面板内 provider/model controls 下沉到 `Advanced runtime settings`

## Copy Rules

- 保留“不是空聊天框”的防漂逻辑
- 但语气要像产品定义，不像辩解

## State Rules

- `Trust Summary` 用 segmented chips 或 status strip
- `blocked` 必须同时给出 manual route
