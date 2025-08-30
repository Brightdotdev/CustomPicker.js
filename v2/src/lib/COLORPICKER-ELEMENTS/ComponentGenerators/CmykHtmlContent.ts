
 const CmykContent = `

    <!-- color preview -->
     <div class="brightdotdev-preview"> peview</div>
        
     <!-- cyan slider container -->
     <div class="brightdotdev-sliderContainer">

          <div class="brightdotdev-colorIdentifyer">
            <label  for="cyan">CYAN</label>
            <input type="text" class="brightdotdev-text" name="cyan" id="cyanText"  min="0" max="100" value="20" >
          </div>

            <input type="range" class="brightdotdev-slider brightdotdev-sSlider" name="cyan" id="cyan" min="0" max="100" value="20" >    
        </div>

     <!-- magenta  slider container -->
        <div class="brightdotdev-sliderContainer">

           <div class="brightdotdev-colorIdentifyer">
            <label  for="magenta">MAGENTA</label>
            <input type="text" class="brightdotdev-text" name="magenta" id="magentaText"  min="0" max="100" value="50" >
           </div>
            <input type="range" class="brightdotdev-slider brightdotdev-sSlider" name="magenta" id="magenta" min="0" max="100" value="50" >    
        </div>  

     <!-- yellow  slider container -->

             <div class="brightdotdev-sliderContainer">

          <div class="brightdotdev-colorIdentifyer">
            <label  for="yellow">YELLOW</label>
            <input type="text" class="brightdotdev-text" name="yellow" id="yellowText"  min="0" max="100" value="70" >
          </div>

            <input type="range" class="brightdotdev-slider brightdotdev-sSlider" name="yellow" id="yellow" min="0" max="100" value="70" >    
        </div> 
        
     <!-- black  slider container -->
        
        <div class="brightdotdev-sliderContainer">

            <div class="brightdotdev-colorIdentifyer">
                <label  for="black">BLACK</label>
                <input type="text" class="brightdotdev-text" name="black" id="blackText"  min="0" max="100" value="30" >
            </div> 

            <input type="range" class="brightdotdev-slider brightdotdev-sSlider" name="black" id="black" min="0" max="100" value="30" >    
        </div>       
`

export default CmykContent