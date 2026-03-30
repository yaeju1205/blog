const fs = require("fs");
const path = require("path");

// 기본적인 구조를 표현합니다
// content -> post 라는 구조를 가집니다
// 기본적으로 txt 와 같은 파일을 블로그 소스로 사용합니다
// html 의 pre element 를 통하여 렌더합니다
// 빌드는 github actions 를 통하여 이루어집니다
// 또한 블로그 소스들은 html 로 컴파일 됩니다

// 블로그의 구조는 github pages 를 사용할 생각입니다만
// 로컬에서도 빌드는 가능하게 도커는 세팅 해둘 생각입니다


// 기본적인 헤더등을 포함한 html 소스를 생성합니다
function create_source(title, source) {
    return `<head>
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
</head>\n${source}`;
}

const title_prefix = "yaeju's blog"

const contents_path = path.join(__dirname, "contents");
const contents_directory = fs.readdirSync(contents_path, "utf-8");
const templates_path = path.join(__dirname, "templates");

var build_source = "";
fs.mkdirSync(templates_path, { recursive: true });

for (let i=0; i < contents_directory.length; i++) {
    const content_name = contents_directory[i];
    const content_path = path.join(contents_path, content_name);
    const content_directory = fs.readdirSync(content_path);
    
    const template_path = path.join(templates_path, content_name);
    fs.mkdirSync(template_path, { recursive: true });

    var post_build_source = "";
    for (let j=0; j < content_directory.length; j++) {
        const post_name = content_directory[j];
        post_build_source = post_build_source + `
<h2>
    <a href="${content_name}/${post_name}.html">${post_name}</a>
</h2>
`;
        fs.writeFileSync(
            path.join(template_path, `${post_name}.html`),
            create_source(
                `${title_prefix} -> ${content_name} -> ${post_name}`,
                `<pre>${fs.readFileSync(path.join(content_path, post_name))}</pre>`
            )
        );
    }
    
    build_source = build_source + `
<h1>
    <a href="templates/${content_name}">${content_name}</a>
</h1>
`;
    fs.writeFileSync(
        `${template_path}/index.html`,
        create_source(
            `${title_prefix} -> ${content_name}`,
            post_build_source
        ),
        "utf-8"
    );
}

fs.writeFileSync(
    "index.html",
    create_source(title_prefix, build_source),
    "utf-8"
);