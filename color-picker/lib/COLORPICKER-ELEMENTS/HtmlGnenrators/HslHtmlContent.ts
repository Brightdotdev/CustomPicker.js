
     const HslHtmlContent = document.createElement('div');
     HslHtmlContent.id = 'hsl';
     HslHtmlContent.classList.add("hslPicker", "colorPickers")
     HslHtmlContent.innerHTML = 
     `   
      <!-- color preview -->
        <div class="preview"> peview</div>
     
            <!-- Hue slider -->
        <div class="sliderContainer">
            <div class="colorIdentifyer">
                <label class="label"  for="hue">HUE</label>
            <input type="text" class="text" name="hue" id="hueText"  min="0" max="360" value="20" > 
            </div>
          
            <input type="range" class="slider"  name="hue" id="hue" min="0" max="360" value="20" >
        </div>
        
            <!-- saturation slider -->
        <div class="sliderContainer">    
        <div class="colorIdentifyer">
            <label class="label"  for="saturation">SATURATION</label>
            <input type="text" class="text" name="saturation" id="saturationText"  min="0" max="100" value="100" >
        </div>
            <input type="range" class="slider sSlider" name="saturation" id="saturation" min="0" max="100" value="100" >    
        </div>

            <!-- lightness slider -->
        <div  class="sliderContainer">
            <div class="colorIdentifyer">
                <label class="label"  for="lightness">LIGHTNESS</label>
                <input type="text" class="text" name="lightness" id="lightnessText"  min="0" max="100" value="50">
            </div>
            <input type="range" class="slider sSlider" name="lightness" id="lightness" min="0" max="100" value="50" >
        </div>
    `


    export default HslHtmlContent