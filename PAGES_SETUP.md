# 风过牧野 · 点击即玩的 GitHub Pages 发布

你的仓库：[mynameisspiderman266-stack/meadow-run](https://github.com/mynameisspiderman266-stack/meadow-run)

**部署成功后，在线试玩地址：**

[▶ 在线试玩：风过牧野](https://mynameisspiderman266-stack.github.io/meadow-run/)

这个地址是按账号和仓库名称确定的目标地址；本次本地交付未执行上传或开启 Pages，部署成功之前可能显示 404。

## 为什么别人的仓库能“点开就玩”

参考游戏的 README 链接到了 github.io 网页：仓库存文件，GitHub Pages 将网页发布到 HTTPS 地址。你的游戏已经有编译好的 Unity WebGL 网页，也可以用同样方式托管。此前约 578 MiB 的包用于 Unity 编辑协作；本次约 20 MiB 的包用于浏览器直接加载。[GitHub Pages 官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

## 1. 开启 Pages

打开 [仓库 Pages 设置](https://github.com/mynameisspiderman266-stack/meadow-run/settings/pages)，在 **Build and deployment → Source** 选择 **GitHub Actions**。不用点新建工作流，也不用选择 Jekyll。

免费账号的 Pages 需要公开仓库；私有仓库是否可用取决于账号方案。如果页面要求升级，而你希望 Unity 源码继续私有，可以新建一个公开仓库 `meadow-play`，只放本次的网页发布文件。相同工作流也能使用，网页地址相应变为 `https://mynameisspiderman266-stack.github.io/meadow-play/`。不用把完整 Unity 工程公开。[Pages 可用范围与发布设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 2. 上传本次网页内容

推荐沿用你已经在 GitHub Desktop 中使用的 meadow-run 仓库：

1. 在 Desktop 选中 `meadow-run`，先 **Fetch origin / Pull origin**，切到默认分支（通常是 main）。
2. 选择 **Repository → Show in Explorer**，打开你实际提交到 GitHub 的本地仓库。
3. 解压 `Meadow_0.4.0_GitHub_Pages_Update.zip`，将里面的 **WebGL 文件夹、.github 文件夹**合并复制到该仓库根目录。如果已经有 `.github`，只添加本次的 `workflows/deploy-pages.yml`，保留其他文件。不要复制成多套一层的目录，不要删除原来的 Assets、Packages 或 ProjectSettings。
4. 可一并复制 `PAGES_SETUP.md` 与 `README_PLAY_LINK.md`，它们只是说明文件，不影响网站。
5. 回到 Desktop，Summary 填 `Publish playable WebGL demo`，点击 **Commit to main → Push origin**。工作流只发布 WebGL 文件夹，不将 Unity 源文件或缓存打到网页。

若你只使用浏览器：在默认分支点 **Add file → Upload files**，拖入解压后的 `WebGL` 文件夹，并提交；随后点 **Add file → Create new file**，文件名填 `.github/workflows/deploy-pages.yml`，复制包内同名文件的全部内容并提交。这可以确保 `.github` 没有被浏览器文件选择器遗漏。这里每个资源都低于 25 MiB，无需上传 ZIP 本身。

正确结构：

```text
meadow-run/
  .github/workflows/deploy-pages.yml
  WebGL/
    .gitattributes
    .nojekyll
    index.html
    site.css
    site.js
    SHA256SUMS.txt
    FONT-LICENSE.txt
    Build/
    StreamingAssets/MeadowContent/0.4.0/
  Assets/                 ← 已有源码保留
  Packages/
  ProjectSettings/
  README.md
```

## 3. 等待网页发布

在 [Actions](https://github.com/mynameisspiderman266-stack/meadow-run/actions) 找到 **Publish Meadow Run to GitHub Pages**，等本次运行显示绿色成功，然后打开上方在线试玩链接。进入网页会先下载游戏、显示加载进度，再进入游戏；玩家不需要安装 Unity 或下载源码。

如果你在上传后才开启 Pages，或之前运行失败，可点进该工作流 → **Run workflow** → 选择默认分支 → 再点 **Run workflow**。必须将 Pages 的 Source 设成 GitHub Actions；不要设成 Deploy from a branch 的根目录，那会把整个源码目录当网站。

## 4. 在仓库首页加“在线玩”

在 GitHub 打开 README.md，点铅笔编辑，在开头添加下面两行，保存提交；不要覆盖自己已写好的项目说明。

```markdown
## 在线试玩
[▶ 点击即玩：风过牧野](https://mynameisspiderman266-stack.github.io/meadow-run/)
```

也可以复制包内 `README_PLAY_LINK.md` 的内容。这样仓库首页就会出现和参考项目类似的可点击试玩入口。只修改 README 不会触发重新发布游戏。

## 后续更新与排查

- 更新玩法、美术后，先用 Unity 的腾讯云 ZIP 导出入口重建 WebGL；`Tools/package_github_pages.py` 从该已编译包整理网页，不会替代 Unity 编译。将新的 WebGL 文件与对应源码一起提交并 Push，工作流自动重新发布。
- 网页包使用相对路径，适配 `/meadow-run/` 子目录；五个资源包与网页同站点，不需要填本机地址或外部 CDN。
- 已有 gzip 解压回退，保留 `.unityweb` 文件原名；未开启 WebGL 线程，不需要额外配置跨源隔离响应头。[Unity 部署说明](https://docs.unity3d.com/2022.3/Documentation/Manual/webgl-deploying.html)
- `.gitattributes` 保留网页文件的原始字节，工作流会先校验 SHA256，再上传 WebGL 文件夹。不要对这些已编译资源启用 LFS。
- 404：先检查 Actions 是否绿色、Pages 是否已开启，访问地址包含 `/meadow-run/`。网页能开但资源失败：检查 Build 和 StreamingAssets 层级、文件大小写及 SHA256，不要把二进制请求重写为 index.html。
- 本次只做本地文件、路径、压缩、哈希与工作流配置检查；没有登录 GitHub、启用远端 Pages、启动 Unity Play 或浏览器跑测。线上加载和手机实际体验由你试玩确认。
