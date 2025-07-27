#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

interface ComponentInfo {
  name: string;
  slug: string;
  category: string;
  path: string;
  hasCSS: boolean;
  hasTailwind: boolean;
  hasTypeScript: boolean;
  dependencies: string[];
}

interface CategoryInfo {
  name: string;
  slug: string;
  components: ComponentInfo[];
}

// Based on the comprehensive exploration of ReactBits repository
const categories: CategoryInfo[] = [
  {
    name: "Animations",
    slug: "animations",
    components: [
      { name: "Animated Content", slug: "animated-content", category: "animations", path: "src/ts-tailwind/Animations/AnimatedContent/AnimatedContent.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Blob Cursor", slug: "blob-cursor", category: "animations", path: "src/ts-tailwind/Animations/BlobCursor/BlobCursor.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Click Spark", slug: "click-spark", category: "animations", path: "src/ts-tailwind/Animations/ClickSpark/ClickSpark.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Crosshair", slug: "crosshair", category: "animations", path: "src/ts-tailwind/Animations/Crosshair/Crosshair.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Cubes", slug: "cubes", category: "animations", path: "src/ts-tailwind/Animations/Cubes/Cubes.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Fade Content", slug: "fade-content", category: "animations", path: "src/ts-tailwind/Animations/FadeContent/FadeContent.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Glare Hover", slug: "glare-hover", category: "animations", path: "src/ts-tailwind/Animations/GlareHover/GlareHover.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Image Trail", slug: "image-trail", category: "animations", path: "src/ts-tailwind/Animations/ImageTrail/ImageTrail.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Magnet", slug: "magnet", category: "animations", path: "src/ts-tailwind/Animations/Magnet/Magnet.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Magnet Lines", slug: "magnet-lines", category: "animations", path: "src/ts-tailwind/Animations/MagnetLines/MagnetLines.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Meta Balls", slug: "meta-balls", category: "animations", path: "src/ts-tailwind/Animations/MetaBalls/MetaBalls.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Metallic Paint", slug: "metallic-paint", category: "animations", path: "src/ts-tailwind/Animations/MetallicPaint/MetallicPaint.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Noise", slug: "noise", category: "animations", path: "src/ts-tailwind/Animations/Noise/Noise.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Pixel Trail", slug: "pixel-trail", category: "animations", path: "src/ts-tailwind/Animations/PixelTrail/PixelTrail.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Pixel Transition", slug: "pixel-transition", category: "animations", path: "src/ts-tailwind/Animations/PixelTransition/PixelTransition.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Ribbons", slug: "ribbons", category: "animations", path: "src/ts-tailwind/Animations/Ribbons/Ribbons.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Shape Blur", slug: "shape-blur", category: "animations", path: "src/ts-tailwind/Animations/ShapeBlur/ShapeBlur.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Splash Cursor", slug: "splash-cursor", category: "animations", path: "src/ts-tailwind/Animations/SplashCursor/SplashCursor.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Star Border", slug: "star-border", category: "animations", path: "src/ts-tailwind/Animations/StarBorder/StarBorder.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Sticker Peel", slug: "sticker-peel", category: "animations", path: "src/ts-tailwind/Animations/StickerPeel/StickerPeel.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Target Cursor", slug: "target-cursor", category: "animations", path: "src/ts-tailwind/Animations/TargetCursor/TargetCursor.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] }
    ]
  },
  {
    name: "Backgrounds",
    slug: "backgrounds",
    components: [
      { name: "Aurora", slug: "aurora", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/Aurora/Aurora.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Balatro", slug: "balatro", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/Balatro/Balatro.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Ballpit", slug: "ballpit", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/Ballpit/Ballpit.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Beams", slug: "beams", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/Beams/Beams.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Dark Veil", slug: "dark-veil", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/DarkVeil/DarkVeil.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Dither", slug: "dither", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/Dither/Dither.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Dot Grid", slug: "dot-grid", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/DotGrid/DotGrid.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Faulty Terminal", slug: "faulty-terminal", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/FaultyTerminal/FaultyTerminal.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Galaxy", slug: "galaxy", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/Galaxy/Galaxy.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Grid Distortion", slug: "grid-distortion", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/GridDistortion/GridDistortion.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Grid Motion", slug: "grid-motion", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/GridMotion/GridMotion.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Hyperspeed", slug: "hyperspeed", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/Hyperspeed/Hyperspeed.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Iridescence", slug: "iridescence", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/Iridescence/Iridescence.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Letter Glitch", slug: "letter-glitch", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/LetterGlitch/LetterGlitch.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Light Rays", slug: "light-rays", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/LightRays/LightRays.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Lightning", slug: "lightning", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/Lightning/Lightning.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Liquid Chrome", slug: "liquid-chrome", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/LiquidChrome/LiquidChrome.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Orb", slug: "orb", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/Orb/Orb.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Particles", slug: "particles", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/Particles/Particles.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Ripple Grid", slug: "ripple-grid", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/RippleGrid/RippleGrid.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Silk", slug: "silk", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/Silk/Silk.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Squares", slug: "squares", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/Squares/Squares.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Threads", slug: "threads", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/Threads/Threads.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Waves", slug: "waves", category: "backgrounds", path: "src/ts-tailwind/Backgrounds/Waves/Waves.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] }
    ]
  },
  {
    name: "Text Animations",
    slug: "text-animations",
    components: [
      { name: "ASCII Text", slug: "ascii-text", category: "text-animations", path: "src/ts-tailwind/TextAnimations/ASCIIText/ASCIIText.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Blur Text", slug: "blur-text", category: "text-animations", path: "src/ts-tailwind/TextAnimations/BlurText/BlurText.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Circular Text", slug: "circular-text", category: "text-animations", path: "src/ts-tailwind/TextAnimations/CircularText/CircularText.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Count Up", slug: "count-up", category: "text-animations", path: "src/ts-tailwind/TextAnimations/CountUp/CountUp.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Curved Loop", slug: "curved-loop", category: "text-animations", path: "src/ts-tailwind/TextAnimations/CurvedLoop/CurvedLoop.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Decrypted Text", slug: "decrypted-text", category: "text-animations", path: "src/ts-tailwind/TextAnimations/DecryptedText/DecryptedText.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Falling Text", slug: "falling-text", category: "text-animations", path: "src/ts-tailwind/TextAnimations/FallingText/FallingText.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Fuzzy Text", slug: "fuzzy-text", category: "text-animations", path: "src/ts-tailwind/TextAnimations/FuzzyText/FuzzyText.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Glitch Text", slug: "glitch-text", category: "text-animations", path: "src/ts-tailwind/TextAnimations/GlitchText/GlitchText.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Gradient Text", slug: "gradient-text", category: "text-animations", path: "src/ts-tailwind/TextAnimations/GradientText/GradientText.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Rotating Text", slug: "rotating-text", category: "text-animations", path: "src/ts-tailwind/TextAnimations/RotatingText/RotatingText.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Scrambled Text", slug: "scrambled-text", category: "text-animations", path: "src/ts-tailwind/TextAnimations/ScrambledText/ScrambledText.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Scroll Float", slug: "scroll-float", category: "text-animations", path: "src/ts-tailwind/TextAnimations/ScrollFloat/ScrollFloat.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Scroll Reveal", slug: "scroll-reveal", category: "text-animations", path: "src/ts-tailwind/TextAnimations/ScrollReveal/ScrollReveal.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Scroll Velocity", slug: "scroll-velocity", category: "text-animations", path: "src/ts-tailwind/TextAnimations/ScrollVelocity/ScrollVelocity.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Shiny Text", slug: "shiny-text", category: "text-animations", path: "src/ts-tailwind/TextAnimations/ShinyText/ShinyText.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Split Text", slug: "split-text", category: "text-animations", path: "src/ts-tailwind/TextAnimations/SplitText/SplitText.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Text Cursor", slug: "text-cursor", category: "text-animations", path: "src/ts-tailwind/TextAnimations/TextCursor/TextCursor.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Text Pressure", slug: "text-pressure", category: "text-animations", path: "src/ts-tailwind/TextAnimations/TextPressure/TextPressure.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Text Trail", slug: "text-trail", category: "text-animations", path: "src/ts-tailwind/TextAnimations/TextTrail/TextTrail.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Text Type", slug: "text-type", category: "text-animations", path: "src/ts-tailwind/TextAnimations/TextType/TextType.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "True Focus", slug: "true-focus", category: "text-animations", path: "src/ts-tailwind/TextAnimations/TrueFocus/TrueFocus.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Variable Proximity", slug: "variable-proximity", category: "text-animations", path: "src/ts-tailwind/TextAnimations/VariableProximity/VariableProximity.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] }
    ]
  },
  {
    name: "Components",
    slug: "components",
    components: [
      { name: "Animated List", slug: "animated-list", category: "components", path: "src/ts-tailwind/Components/AnimatedList/AnimatedList.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Bounce Cards", slug: "bounce-cards", category: "components", path: "src/ts-tailwind/Components/BounceCards/BounceCards.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Card Swap", slug: "card-swap", category: "components", path: "src/ts-tailwind/Components/CardSwap/CardSwap.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Carousel", slug: "carousel", category: "components", path: "src/ts-tailwind/Components/Carousel/Carousel.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Chroma Grid", slug: "chroma-grid", category: "components", path: "src/ts-tailwind/Components/ChromaGrid/ChromaGrid.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Circular Gallery", slug: "circular-gallery", category: "components", path: "src/ts-tailwind/Components/CircularGallery/CircularGallery.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Counter", slug: "counter", category: "components", path: "src/ts-tailwind/Components/Counter/Counter.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Decay Card", slug: "decay-card", category: "components", path: "src/ts-tailwind/Components/DecayCard/DecayCard.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Dock", slug: "dock", category: "components", path: "src/ts-tailwind/Components/Dock/Dock.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Elastic Slider", slug: "elastic-slider", category: "components", path: "src/ts-tailwind/Components/ElasticSlider/ElasticSlider.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Flowing Menu", slug: "flowing-menu", category: "components", path: "src/ts-tailwind/Components/FlowingMenu/FlowingMenu.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Fluid Glass", slug: "fluid-glass", category: "components", path: "src/ts-tailwind/Components/FluidGlass/FluidGlass.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Flying Posters", slug: "flying-posters", category: "components", path: "src/ts-tailwind/Components/FlyingPosters/FlyingPosters.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Folder", slug: "folder", category: "components", path: "src/ts-tailwind/Components/Folder/Folder.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Glass Icons", slug: "glass-icons", category: "components", path: "src/ts-tailwind/Components/GlassIcons/GlassIcons.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Glass Surface", slug: "glass-surface", category: "components", path: "src/ts-tailwind/Components/GlassSurface/GlassSurface.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Gooey Nav", slug: "gooey-nav", category: "components", path: "src/ts-tailwind/Components/GooeyNav/GooeyNav.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Infinite Menu", slug: "infinite-menu", category: "components", path: "src/ts-tailwind/Components/InfiniteMenu/InfiniteMenu.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Infinite Scroll", slug: "infinite-scroll", category: "components", path: "src/ts-tailwind/Components/InfiniteScroll/InfiniteScroll.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Lanyard", slug: "lanyard", category: "components", path: "src/ts-tailwind/Components/Lanyard/Lanyard.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Magic Bento", slug: "magic-bento", category: "components", path: "src/ts-tailwind/Components/MagicBento/MagicBento.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Masonry", slug: "masonry", category: "components", path: "src/ts-tailwind/Components/Masonry/Masonry.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Model Viewer", slug: "model-viewer", category: "components", path: "src/ts-tailwind/Components/ModelViewer/ModelViewer.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Pixel Card", slug: "pixel-card", category: "components", path: "src/ts-tailwind/Components/PixelCard/PixelCard.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Rolling Gallery", slug: "rolling-gallery", category: "components", path: "src/ts-tailwind/Components/RollingGallery/RollingGallery.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Scroll Stack", slug: "scroll-stack", category: "components", path: "src/ts-tailwind/Components/ScrollStack/ScrollStack.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Spotlight Card", slug: "spotlight-card", category: "components", path: "src/ts-tailwind/Components/SpotlightCard/SpotlightCard.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Stack", slug: "stack", category: "components", path: "src/ts-tailwind/Components/Stack/Stack.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Stepper", slug: "stepper", category: "components", path: "src/ts-tailwind/Components/Stepper/Stepper.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] },
      { name: "Tilted Card", slug: "tilted-card", category: "components", path: "src/ts-tailwind/Components/TiltedCard/TiltedCard.tsx", hasCSS: false, hasTailwind: true, hasTypeScript: true, dependencies: [] }
    ]
  },
  {
    name: "Buttons",
    slug: "buttons",
    components: [
      { name: "Button 1", slug: "button-1", category: "buttons", path: "src/Buttons/Button1/Button1.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Button 2", slug: "button-2", category: "buttons", path: "src/Buttons/Button2/Button2.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Button 3", slug: "button-3", category: "buttons", path: "src/Buttons/Button3/Button3.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Button 4", slug: "button-4", category: "buttons", path: "src/Buttons/Button4/Button4.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Button 5", slug: "button-5", category: "buttons", path: "src/Buttons/Button5/Button5.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Button 6", slug: "button-6", category: "buttons", path: "src/Buttons/Button6/Button6.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Button 7", slug: "button-7", category: "buttons", path: "src/Buttons/Button7/Button7.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Button 8", slug: "button-8", category: "buttons", path: "src/Buttons/Button8/Button8.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] }
    ]
  },
  {
    name: "Forms",
    slug: "forms",
    components: [
      { name: "Form 1", slug: "form-1", category: "forms", path: "src/Forms/Form1/Form1.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 2", slug: "form-2", category: "forms", path: "src/Forms/Form2/Form2.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 3", slug: "form-3", category: "forms", path: "src/Forms/Form3/Form3.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 4", slug: "form-4", category: "forms", path: "src/Forms/Form4/Form4.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 5", slug: "form-5", category: "forms", path: "src/Forms/Form5/Form5.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 6", slug: "form-6", category: "forms", path: "src/Forms/Form6/Form6.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 7", slug: "form-7", category: "forms", path: "src/Forms/Form7/Form7.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 8", slug: "form-8", category: "forms", path: "src/Forms/Form8/Form8.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 9", slug: "form-9", category: "forms", path: "src/Forms/Form9/Form9.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 10", slug: "form-10", category: "forms", path: "src/Forms/Form10/Form10.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 11", slug: "form-11", category: "forms", path: "src/Forms/Form11/Form11.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 12", slug: "form-12", category: "forms", path: "src/Forms/Form12/Form12.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 13", slug: "form-13", category: "forms", path: "src/Forms/Form13/Form13.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 14", slug: "form-14", category: "forms", path: "src/Forms/Form14/Form14.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 15", slug: "form-15", category: "forms", path: "src/Forms/Form15/Form15.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 16", slug: "form-16", category: "forms", path: "src/Forms/Form16/Form16.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 17", slug: "form-17", category: "forms", path: "src/Forms/Form17/Form17.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 18", slug: "form-18", category: "forms", path: "src/Forms/Form18/Form18.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 19", slug: "form-19", category: "forms", path: "src/Forms/Form19/Form19.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Form 20", slug: "form-20", category: "forms", path: "src/Forms/Form20/Form20.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] }
    ]
  },
  {
    name: "Loaders",
    slug: "loaders",
    components: [
      { name: "Loader 1", slug: "loader-1", category: "loaders", path: "src/Loaders/Loader1/Loader1.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Loader 2", slug: "loader-2", category: "loaders", path: "src/Loaders/Loader2/Loader2.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Loader 3", slug: "loader-3", category: "loaders", path: "src/Loaders/Loader3/Loader3.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Loader 4", slug: "loader-4", category: "loaders", path: "src/Loaders/Loader4/Loader4.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Loader 5", slug: "loader-5", category: "loaders", path: "src/Loaders/Loader5/Loader5.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Loader 6", slug: "loader-6", category: "loaders", path: "src/Loaders/Loader6/Loader6.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Loader 7", slug: "loader-7", category: "loaders", path: "src/Loaders/Loader7/Loader7.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Loader 8", slug: "loader-8", category: "loaders", path: "src/Loaders/Loader8/Loader8.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] },
      { name: "Loader 9", slug: "loader-9", category: "loaders", path: "src/Loaders/Loader9/Loader9.jsx", hasCSS: true, hasTailwind: false, hasTypeScript: false, dependencies: [] }
    ]
  }
];

async function createFullRegistry() {
  // Calculate total components
  let totalComponents = 0;
  for (const category of categories) {
    totalComponents += category.components.length;
  }

  const registry = {
    lastUpdated: new Date().toISOString(),
    totalComponents,
    categories
  };

  // Create component path map
  const componentPathMap: Record<string, string> = {};
  for (const category of categories) {
    for (const component of category.components) {
      componentPathMap[component.slug] = component.path;
    }
  }

  // Save registry JSON
  const registryPath = path.join(process.cwd(), 'src', 'data', 'component-registry.json');
  await fs.mkdir(path.dirname(registryPath), { recursive: true });
  await fs.writeFile(registryPath, JSON.stringify(registry, null, 2));

  // Save TypeScript mappings
  const tsContent = `// Auto-generated component mappings
// Last updated: ${new Date().toISOString()}

export const componentPathMap: Record<string, string> = ${JSON.stringify(componentPathMap, null, 2)};

export const componentRegistry = ${JSON.stringify(registry, null, 2)};
`;

  const mappingsPath = path.join(process.cwd(), 'src', 'data', 'component-mappings.ts');
  await fs.writeFile(mappingsPath, tsContent);

  console.log('✅ Full component registry created successfully!');
  console.log(`📊 Total components: ${totalComponents}`);
  console.log(`📝 Registry saved to: ${registryPath}`);
  console.log(`📝 TypeScript mappings saved to: ${mappingsPath}`);
}

// Run the script
createFullRegistry().catch(console.error);