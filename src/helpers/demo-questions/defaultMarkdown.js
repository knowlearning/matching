export default {
	name: 'New Markdown',
	md: `# Markdown "How To"

This Markdown editor has a few nify features beyond [basic markdown syntax](https://www.markdownguide.org/basic-syntax/).

### 1. TeX or LaTeX
Most any [TeX or LaTeX expressions](https://wch.github.io/latexsheet/) should work by wrapping them in dollar signs. For example, the gradient of a scalar field $\\phi$ is:

$ \\nabla \\phi = \\left( \\frac{\\partial \\phi}{\\partial x}, \\frac{\\partial \\phi}{\\partial y}, \\frac{\\partial \\phi}{\\partial z} \\right) $

### 2. Html
Most any html will work for content or layout. For example, here's  a little html table.
<div style="display: flex; justify-content: center; align-items: center; margin: 12px;" >
    <table border="1" style="border-collapse: collapse; ">
        <tr style="padding: 8px;">
            <th style="padding: 8px;">Header 1</th>
            <th style="padding: 8px;">Header 2</th>
            <th style="padding: 8px;">Header 3</th>
        </tr>
        <tr style="padding: 8px;">
            <td style="padding: 8px;">Row 1, Cell 1</td>
            <td style="padding: 8px;">Row 1, Cell 2</td>
            <td style="padding: 8px;">Row 1, Cell 3</td>
        </tr>
        <tr style="padding: 8px;">
            <td style="padding: 8px;">Row 2, Cell 1</td>
            <td style="padding: 8px;">Row 2, Cell 2</td>
            <td style="padding: 8px;">Row 2, Cell 3</td>
        </tr>
    </table>
</div>

### 3. KnowLearning Assets

From [KnowLearning's files Application](https://kl-files.netlify.app/), you can drag uuid references to videos, audio, or images. Notice I've mixed with html to center and size it too.
<br><br>
<div style="text-align: center;">
f036b500-37ff-11ef-b423-4126a202cbc5{"width":200, "height": 120}
</div>
`
}