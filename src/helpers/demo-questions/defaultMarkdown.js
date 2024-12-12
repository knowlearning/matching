export default ({ source_language }) => ({
	name: 'New Markdown',
	md: `# Markdown "How To"

This Markdown editor has a few nify features beyond [basic markdown syntax](https://www.markdownguide.org/basic-syntax/).

### 1. TeX or LaTeX
Most any [TeX or LaTeX expressions](https://wch.github.io/latexsheet/) should work by wrapping them in dollar signs. For example, the gradient of a scalar field $\\phi$ is:

$ \\nabla \\phi = \\left( \\frac{\\partial \\phi}{\\partial x}, \\frac{\\partial \\phi}{\\partial y}, \\frac{\\partial \\phi}{\\partial z} \\right) $

### 2. KnowLearning Assets

From [KnowLearning's files Application](https://kl-files.netlify.app/), you can drag uuid references to videos, audio, or images. Notice I've mixed with html to center and size it too.
<br><br>
<div style="text-align: center;">
f036b500-37ff-11ef-b423-4126a202cbc5{"width":200, "height": 120}
</div>

### 3. Html
Most any html will work for content or layout. For example, here's how we can use html to layout and equally spread two KnowLearning image asset.
<div style="display: flex; justify-content: space-around; align-items: center; margin: 12px;" >
36c0baa0-3997-11ef-8a59-2dd88f0ca544{"width": 90, "height": 90}

2e799b50-3d34-11ef-9a0a-db6f64acb29a{"width": 90, "height": 90}
</div>
`
})
