# Fund-digger

`Fund-digger` 是一个命令行工具，用于搜索基金、获取基金详情、历史净值、年度回报和分红数据。通过简单的命令，可以快速获取基金的相关信息，并将结果导出为 CSV 文件。

CSV文件保存路径如下：

- **Windows**: `C:\Users\<用户名>\Documents\Fund-digger\`。
- **macOS**: `/Users/<用户名>/Documents/Fund-digger/`。
- **Linux**: `/home/<用户名>/Documents/Fund-digger/`。

## 安装
克隆或下载压缩文件并解压后，进入项目目录，运行以下命令安装依赖并链接到全局：

```bash
npm install
npm link
```

安装完成后，你可以通过 `fund` 命令来使用该工具。

## 使用

### 1. 搜索基金并导出结果

使用 `dig` 命令，可以根据关键词搜索基金，并获取详细信息，最后将结果导出为 CSV 文件。

```bash
fund dig <keyword> [options]
```

**选项：**
- `-i, --include <tags...>`：仅包含匹配指定标签的基金。
- `-e, --exclude <tags...>`：排除匹配指定标签的基金。
- `-m, --morningstar`：从内置的 Morningstar 精选库中搜索。

**示例：**
```bash
fund dig 沪深300 -i ETF
```

### 2. 搜索基金

使用 `search` 命令，可以根据关键词搜索基金，并在终端中显示结果。

```bash
fund search <keyword> [options]
```

**选项：**
- `-i, --include <tags...>`：仅包含匹配指定标签的基金。
- `-e, --exclude <tags...>`：排除匹配指定标签的基金。
- `-m, --morningstar`：从内置的 Morningstar 精选库中搜索。

**示例：**
```bash
fund search 沪深300 -i 场外 A
```

### 3. **获取基金详情**

使用 `detail` 命令，可以获取指定基金的详细信息。

```bash
fund detail <code>
```

**示例：**
```bash
fund detail 510300
```

### 4. 获取基金历史净值

使用 `nav` 命令，可以获取指定基金的历史净值数据，默认最近20天。

```bash
fund nav <code> [options]
```

**选项：**
- `-s, --start <data>`：开始日期，格式为 `yyyy-mm-dd`。
- `-e, --end <data>`：结束日期，格式为 `yyyy-mm-dd`。
- `-i, --interval <value>`：间隔频率，可选值为 `month` 或 `year`。
- `-c, --cumulative`：显示累计净值。
- `-r, --reverse`：反转结果顺序。

**示例：**
```bash
fund nav 510300 -s 2024-01-01 -e 2024-12-31 -i month
```

### 5. 获取基金年度回报

使用 `returns` 命令，可以获取指定基金的年度回报数据。

```bash
fund returns <code> [options]
```

**选项：**
- `-r, --reverse`：反转结果顺序。

**示例：**
```bash
fund returns 510300
```
