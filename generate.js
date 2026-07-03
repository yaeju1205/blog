const fs = require("fs")
const path = require("path")

const main_title = "yaeju's blog"

const repository_url = "yaeju1205.github.io/blog"

const content_files_path = path.join("contents")
const content_files = fs.readdirSync(content_files_path)

function create_template_source(title, content_file) {
    return `
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            pre {
                font-size: 18px;
                line-height: 1.6;
                padding: 16px;
                white-space: pre-wrap;
                overflow-wrap: break-word;
            }
        </style>
        <title>${title}</title>
    </head>
    <body>
        <pre>
            empty content
        </pre>

        <script type="module">
            const res = await fetch("${repository_url}" + "/contents/" + "${content_file}")
            const text = await res.text()

            document.querySelector("pre").textContent = text
        </script>
    </body >
    `
}

for (const content_file of content_files) {
    fs.writeFileSync(
        path.join(content_file + ".html"),
        create_template_source(`${main_title} -> ${content_file}`, content_file),
        "utf8"
    )
}

fs.writeFileSync(
    "index.html",
    `
    <head>
        <meta charset="UTF-8">
        <title>${main_title}</title>
    </head>
    <body>
    ${content_files.map(
        (content_file) =>
            `<a href = "${content_file}.html"> ${content_file}</a>`
    ).join("<br>\n")}
    </body>
    `,
    "utf8"
)
