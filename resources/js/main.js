function duplicateMarqueeContent() {
  const marquees = document.querySelectorAll(".marquee");

  marquees.forEach((marquee) => {
    const items = marquee.innerHTML;
    const marqueeWidth = marquee.scrollWidth;  
    const containerWidth = marquee.parentElement.offsetWidth;

    const duplicates = Math.ceil(containerWidth / marqueeWidth) + 5;  

    for (let i = 0; i < duplicates; i++) {
      marquee.innerHTML += items;
    }
  });
}

window.addEventListener('load', duplicateMarqueeContent);

window.addEventListener('resize', () => {
  const marquees = document.querySelectorAll('.marquee');
  marquees.forEach(marquee => {
    const originalItems = `
      <span class="marquee-item">Rewind</span>
      <span class="marquee-item">Your</span>
      <span class="marquee-item">History</span>
    `;
    marquee.innerHTML = originalItems;
  });
  duplicateMarqueeContent();
});

let ticking = false;
let scrolled = 0;

window.addEventListener('scroll', () => {

  scrolled = window.pageYOffset;

  if(!ticking){
    window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
    });


function updateParallax(){
  const leafImg = document.querySelector('.leaf-img');

  if(leafImg){
    leafImg.style.transform = `translate(-50%, ${350 + scrolled * 0.2}px) rotate(15deg)`;
  }
  

  ticking = false;
}
