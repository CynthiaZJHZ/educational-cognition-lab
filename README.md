**公开实验链接（部署 GitHub Pages 后由项目作者填写）：** `待填写`

# Educational Cognition Lab：经典认知实验与教学材料设计

> GitHub Pages 为课程加分项。操作步骤请见 `DEPLOY_AND_VERIFY.md`。

**教育学研究关切：教学材料怎样通过视觉线索引导注意，并支持数量信息的准确读取？**

本项目是一个纯前端可交互实验网站，包含两个实验：

1. **箭头 Flanker 侧翼干扰实验（W6）**：复现 congruent / incongruent 效应，并加入“颜色突出中央目标”的新条件。
2. **图形比例判断（W7）**：基于 Cleveland–McGill 的 graphical perception 思路，加入 25% / 50% / 75% 参考刻度条件。

> 注意：本项目测量的是反应时、正确率和比例判断误差，**没有直接测量学习效果**，因此不能据此断定某种教学策略能提高学习成绩。教育学理论对照与迁移边界详见 `EDUCATION_FRAMEWORK.md`。

> 重要：仓库本身不包含伪造结果。课程要求至少 5 名他人真实数据；请完成真实收数后再填写“结果与讨论”。

## 1. 运行方法

### 最简单
直接打开 `index.html`。

### 如果浏览器从 `file://` 打开时拦截网络上传
在项目目录运行：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000/`。

## 2. 收数接口设置

课程接口默认写在 `js/config.js`：

```js
SUBMIT_ENDPOINT: "https://attention-lab-production.up.railway.app/api/hw2/submit"
```

**本次测试版已经写入公开项目码 `6AEEBU`。** 若今后使用其他项目，则在课程 `/hw2` 创建项目并更新 `js/config.js` 的 `PROJECT_CODE`。该配置会自动被所有被试使用，无需他们自己填写。**严禁把下载密钥写入项目或公开GitHub仓库**。

每个实验结束后：
- 数据先写入浏览器 `localStorage`；
- 若项目码配置正确，会尝试 POST 到课程接口；
- 会检查后端 `ok`、`record_id` 和 `warnings`；即使返回成功，也需要检查有没有字段截断或转换；
- 即使网络失败，也能下载 CSV / JSON 备份。

**测试/正式隔离**：调试时将 `js/config.js` 的 `TEST_MODE` 设为 `true`，上传的实验名将加 `test_` 前缀（例如 `test_flanker_arrow_improved`）；正式招募前恢复 `false`，并从 `/hw2` 删除测试记录。

## 3. 实验 1：箭头 Flanker

### 3.1 经典范式
当前采用**箭头 Flanker 变式**：显示五个箭头，仅判断第 3 个箭头的方向。
- 中间 `←`：按键盘 `←`
- 中间 `→`：按键盘 `→`
- 一致试次：`← ← ← ← ←` 或 `→ → → → →`。
- 不一致试次：`→ → ← → →` 或 `← ← → ← ←`。

这种直观的刺激—反应映射避免了记忆“H/S 对应 F/J”的额外负担。**1974年 Eriksen & Eriksen 原始研究使用字母；本项目采用的是后来广泛应用的箭头变式，不应称为严格复现原始字母刺激**。不把原始研究已操纵过的间距变化当作新增改进。

### 3.2 设计
2 × 2 被试内设计：

- 侧翼一致性：`congruent` / `incongruent`
- 目标视觉突出：`standard` / `highlight`

正式阶段每格 12 次，共 48 次。练习 8 次。

### 3.3 因变量
- 反应时（`performance.now()`）
- 正确率

主分析只纳入：
- 正确 trial；
- `150 ms ≤ RT ≤ 3000 ms`。

对每位参与者分别计算：

`Flanker effect = mean(RT_incongruent) - mean(RT_congruent)`

再比较 standard 与 highlight 两种条件下的 Flanker effect。

## 4. 实验 2：图形比例判断

### 4.1 理论来源
Cleveland & McGill (1984) 将 graphical perception 视为从图形编码中提取定量信息的视觉解码过程，并比较多类 elementary perceptual tasks 的准确性。本项目采用一个适合网页复现的比例估计任务。

### 4.2 设计
被试内两条件：
- `none`：无参考刻度；
- `quartile`：显示 25% / 50% / 75% 参考线。

两种条件使用相同的 12 个真实比例并随机呈现，共 24 次正式试次；练习 4 次。

### 4.3 因变量
`absolute_error_pct = |response_pct - true_pct|`

参与者层级比较：
- 无刻度平均绝对误差；
- 有参考刻度平均绝对误差。

## 5. 真实数据分析

打开 `analysis.html`：

1. 点击“读取课程后台匿名数据”，或者导入 `/hw2` 下载的 CSV / JSON，或者点击“加载本机数据”；
2. 程序会先按参与者聚合；
3. 显示：
   - 条件均值；
   - 改进量；
   - 配对样本 t 检验；
   - Cohen's dz；
   - 条形图；
   - 参与者层级汇总表；
   - 可粘贴到 README 的**数字结果草稿**。

注意：**多个 trial 不是多个独立被试**。统计检验以参与者为分析单位。

## 6. 结果与讨论（收真实数据后填写）

### 6.1 Flanker
- 可分析参与者 n = `待填写`
- standard Flanker effect = `待填写 ms`
- highlight Flanker effect = `待填写 ms`
- 配对检验 = `待填写`
- 是否复现经典效应：`由学生基于真实数据独立判断`
- 新增条件是否支持预测：`由学生独立判断`
- 与 Eriksen & Eriksen (1974) 的关系：`待填写`

### 6.2 图形比例判断
- 可分析参与者 n = `待填写`
- 无刻度平均绝对误差 = `待填写 %`
- 参考刻度平均绝对误差 = `待填写 %`
- 配对检验 = `待填写`
- 是否支持参考刻度改进：`由学生基于真实数据独立判断`
- 与 Cleveland & McGill (1984) 的关系：`待填写`

## 7. 教育学讨论（真实收数后由学生本人完成）

- **实验1**：视觉突出目标能否减轻非目标信息对注意选择的干扰？可以联系课件中的重点突出，但不能把 RT 的变化直接等同于知识学习结果。
- **实验2**：增加参考刻度是否降低数据读取误差？可以联系统计图的教学呈现，但不能把读图准确率直接等同于统计知识的掌握。
- **两项实验的共同局限**：非真实课堂、样本量小、简单任务与复杂学习任务不同。应报告不显著结果与个体差异，不应只选择支持假设的数据。

## 8. 目录结构

```text
attention_lab_hw2/
├── index.html
├── flanker.html
├── graphical.html
├── analysis.html
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   ├── common.js
│   ├── flanker.js
│   ├── graphical.js
│   └── analysis.js
├── analysis/
│   └── analyze.py
├── data/
│   └── README.md
├── DEPLOY_AND_VERIFY.md
├── TASK_CHECKLIST.md
├── PREDICTIONS.md
├── EDUCATION_FRAMEWORK.md
├── AI_USE.md
└── README.md
```

## 9. AI 使用说明

见 `AI_USE.md`。课程规则要求问题界定、预测、数据解释与设计决策由学生本人完成，因此 `PREDICTIONS.md` 明确标为 AI 辅助草稿，必须在收数前由学生独立核查/重写，并如实提交 AI 使用说明。

## 10. 参考文献

Eriksen, B. A., & Eriksen, C. W. (1974). Effects of noise letters upon the identification of a target letter in a nonsearch task. *Perception & Psychophysics, 16*(1), 143–149. https://doi.org/10.3758/BF03203267

Cleveland, W. S., & McGill, R. (1984). Graphical perception: Theory, experimentation, and application to the development of graphical methods. *Journal of the American Statistical Association, 79*(387), 531–554. https://doi.org/10.1080/01621459.1984.10478080

Mayer, R. E., & Moreno, R. (2003). Nine ways to reduce cognitive load in multimedia learning. *Educational Psychologist, 38*(1), 43–52. https://doi.org/10.1207/S15326985EP3801_6

Richter, J., Scheiter, K., & Eitel, A. (2016). Signaling text–picture relations in multimedia learning: A comprehensive meta-analysis. *Educational Research Review, 17*, 19–36. https://doi.org/10.1016/j.edurev.2015.12.003

### 与旧字母版的区分

如先前收集过正式的 H/S 版本数据，请勿直接与本版合并。箭头版使用独立的后台实验名 `flanker_arrow_improved`（测试模式为 `test_flanker_arrow_improved`），数据含 `stimulus_type: arrow`、`response_key`，便于区分。操作说明由 AI 辅助修订，学生应在收数前独立确认预测。

**箭头任务参考**：Ridderinkhof, K. R., et al. (2021). The arrow of time: Advancing insights into action control from the arrow version of the Eriksen flanker task. *Attention, Perception, & Psychophysics*. https://pmc.ncbi.nlm.nih.gov/articles/PMC7884358/
