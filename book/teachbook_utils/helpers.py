import base64

from IPython.display import IFrame, Markdown, HTML, display

pyp5js_base_url = "https://abav.lugaralgum.com/pyp5js/py5mode/"
EDITOR_URL = pyp5js_base_url + "?sketch="
FULLSCREEN_URL = pyp5js_base_url + "fullscreen.html?sketch="
PRESENTATION_URL = pyp5js_base_url + "presentation.html?sketch="
EXT_PADDING = 16


def encode_as_base64(input_string) -> str:
    code_b64 = base64.b64encode(input_string.encode("utf-8")).decode("utf-8")
    return code_b64


def url_with_base64_arg(base_url: str, input_string: str) -> str:
    encoded_string = encode_as_base64(input_string)
    return f"{base_url}{encoded_string}"


def display_as_iframe(url: str, **iframe_params) -> None:
    iframe = IFrame(src=url, **iframe_params)
    display(iframe)


def display_code_as_markdown(code: str, language="python") -> None:
    code = code.strip()
    display(Markdown(f"```{language}\n{code}\n```"))


def display_pyp5js_iframe(
    code: str,
    base_url: str = PRESENTATION_URL,
    show_url=False,
    edit_button=False,
    extra_padding: int = EXT_PADDING,
    **iframe_params,
) -> None:
    code = code.strip()
    url = url_with_base64_arg(base_url, code)
    if show_url:
        print(f"URL: {url}")
    if "width" in iframe_params:
        iframe_params["width"] += extra_padding
    if "height" in iframe_params:
        iframe_params["height"] += extra_padding
    display_as_iframe(url, **iframe_params)
    if edit_button:
        display_link_button(code)


def display_link_button(
    code: str, base_url: str = EDITOR_URL, text: str = "Im Online-Editor bearbeiten"
) -> None:
    code = code.strip()
    url = url_with_base64_arg(base_url, code)
    html = f"""
    <a class="sd-btn sd-btn-primary sd-btn-sm"
       href="{url}">
       {text}
    </a>
    """
    display(HTML(html))
