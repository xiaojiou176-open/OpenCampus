# Extension Options Override

## Purpose

这页是完整的 settings/auth center，不是模型实验室。

## Override Rules

1. 顺序固定为：
   - `Connection summary`
   - `Language + AI/BFF status summary`
   - `Authorization / reading boundaries`
   - `Boundary disclosure`
   - `Site configuration`
   - `Advanced runtime settings`
   - `Export defaults`
2. provider readiness 做成 compact status list
3. autodiscovery 成功时，手填 BFF 只作为 fallback/override 存在
4. `OpenAI / Gemini / Switchyard model` 默认归入 advanced
5. 保存按钮固定在表单底部，并显示 unsaved state

## Copy Rules

- `Only override when autodiscovery fails or you truly need a custom local address.`
- 所有 boundary 文案必须在第一屏可见
