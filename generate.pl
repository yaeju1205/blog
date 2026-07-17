use strict;
use warnings;
use utf8;

use File::Spec;

my $main_title = "yaeju's blog";
my $content_files_path = "contents";

opendir(my $content_files_dir, $content_files_path)
    or die "Cannot open '$content_files_path': $!";

my @content_files =
    grep {
        -f File::Spec->catfile($content_files_path, $_)
    }
    readdir($content_files_dir);

closedir($content_files_dir);

sub create_template_source {
    my ($title, $content_file) = @_;

    return <<"HTML";
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
    <title>$title</title>
</head>
<body>
    <pre>
        empty content
    </pre>

    <script type="module">
        const res = await fetch("https://raw.githubusercontent.com/yaeju1205/blog/main/contents/" + "$content_file")
        const text = await res.text()

        document.querySelector("pre").textContent = text
    </script>
</body>
HTML
}

for my $content_file (@content_files) {
    open(my $content_html_file, ">:utf8", "$content_file.html")
        or die "Cannot write '$content_file.html': $!";

    print $content_html_file create_template_source(
        "$main_title -> $content_file",
        $content_file
    );

    close($content_html_file );
}

@content_files = sort @content_files;

open(my $index, ">:utf8", "index.html")
    or die "Cannot write index.html: $!";

print $index <<"HTML";
<head>
    <meta charset="UTF-8">
    <title>$main_title</title>
</head>
<body>
HTML

for my $content_file (@content_files) {
    print $index qq{<a href="$content_file.html">$content_file</a><br>\n};
}

print $index <<"HTML";
</body>
HTML

close($index);
