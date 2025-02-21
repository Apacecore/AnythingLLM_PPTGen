import aspose.slides as slides
import os

def ppt_to_svg(pptx_path, output_dir):
    with slides.Presentation(pptx_path) as presentation:
        for slide in presentation.slides:
            slide_number = slide.slide_number
            output_file = os.path.join(output_dir, f"presentation_slide_{slide_number}.svg")
            with open(output_file, "wb") as file:
                slide.write_as_svg(file)
            print(f"Slide {slide_number} converted to SVG: {output_file}")

if __name__ == "__main__":
    import sys
    pptx_path = sys.argv[1]
    output_dir = sys.argv[2]
    ppt_to_svg(pptx_path, output_dir)
