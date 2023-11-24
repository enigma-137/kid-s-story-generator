import { process } from '/env'

// openAi config
import { Configuration, OpenAIApi } from 'openai'

// variables
const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')

// initiate openAi config
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
// passconfig to openai
const openai = new OpenAIApi(configuration)

// function to send text
document.getElementById("send-btn").addEventListener ("click", () => {

  const setupTextarea = document.getElementById('setup-textarea')
  if (setupTextarea.value) {

    const userInput = setupTextarea.value
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
    movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`

    fetchBotReply(userInput)
    fetchSynopsis(userInput)
    
  }

})

async function fetchBotReply(outline) {
  const response = await openai.createCompletion({
    'model': 'text-davinci-003',
    'prompt': `Generate a short message to enthusiastically say an outline sounds interesting and that you need some minutes to think about it.
    ###
    outline: Two dogs fall in love and move to Hawaii to learn to surf.
    message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
    ###
    outline: A plane crashes in the jungle and the passengers have to walk 1000km to safety.
    message: I'll spend a few moments considering that. But I love your idea!! A disaster movie in the jungle!
    ###
    outline: A group of corrupt lawyers try to send an innocent woman to jail.
    message: Wow that is awesome! Corrupt lawyers, huh? Give me a few moments to think!
    ###
    outline: ${outline}
    message: 
    `,
    max_tokens: 60
    // 100 tokens is 75 words
  })
  movieBossText.innerText = response.data.choices[0].text.trim()
}

// fetches synopsis 

const fetchSynopsis = async (outline) => {
  const response = await openai.createCompletion({
    'model': 'text-davinci-003',
    'prompt': `Generate an engaging, professional and marketable story book synopsis based on an outline
    ###
    outline: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
    synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
    ###
    outline: ${outline}
    synopsis: 
    `,
    max_tokens: 1000
  })

  const synopsis = response.data.choices[0].text.trim()
  document.getElementById('output-text').innerText = synopsis

  fetchTitle(synopsis)

  setupInputContainer.innerHTML = `<button id="view-pitch-btn" class="view-pitch-btn">View story</button>`
  // setXurl.innerHTML = `
  document.getElementById('view-pitch-btn').addEventListener('click', ()=>{
    document.getElementById('setup-container').style.display = 'block'
    document.getElementById('output-container').style.display = 'flex'
    movieBossText.innerText = `This story is so cool I'm jealous! It's gonna make you smile for sure! Remember, to shout out to Enigma💰`

    document.getElementById('view-pitch-btn').style.display = "none"
  })

}

// fetchs title

const fetchTitle = async (synopsis) => {
  const response = await openai.createCompletion({
    'model': 'text-davinci-003',
    'prompt': `Generate a catchy story book title for the synopsis ${synopsis}`,
    max_tokens: 25,

  })

  const title = response.data.choices[0].text.trim()
  document.getElementById('output-title').innerText = title
  fetchImage(title, synopsis)

}


// fetch image
const fetchImage = async (title, synopsis) => {
  const response = await openai.createCompletion({
    'model': 'text-davinci-003',
    'prompt': `Give a short description of an image which could be used to advertise a story book based on a title and synopsis. The description should be rich in visual detail but contain no names.
    ###
    title: Love's Time Warp
    synopsis: When scientist and time traveller Wendy (Emma Watson) is sent back to the 1920s to assassinate a future dictator, she never expected to fall in love with them. As Wendy infiltrates the dictator's inner circle, she soon finds herself torn between her mission and her growing feelings for the leader (Brie Larson). With the help of a mysterious stranger from the future (Josh Brolin), Wendy must decide whether to carry out her mission or follow her heart. But the choices she makes in the 1920s will have far-reaching consequences that reverberate through the ages.
    image description: A silhouetted figure stands in the shadows of a 1920s speakeasy, her face turned away from the camera. In the background, two people are dancing in the dim light, one wearing a flapper-style dress and the other wearing a dapper suit. A semi-transparent image of war is super-imposed over the scene.
    ###
    title: zero Earth
    synopsis: When bodyguard Kob (Daniel Radcliffe) is recruited by the United Nations to save planet Earth from the sinister Simm (John Malkovich), an alien lord with a plan to take over the world, he reluctantly accepts the challenge. With the help of his loyal sidekick, a brave and resourceful hamster named Gizmo (Gaten Matarazzo), Kob embarks on a perilous mission to destroy Simm. Along the way, he discovers a newfound courage and strength as he battles Simm's merciless forces. With the fate of the world in his hands, Kob must find a way to defeat the alien lord and save the planet.
    image description: A tired and bloodied bodyguard and hamster standing atop a tall skyscraper, looking out over a vibrant cityscape, with a rainbow in the sky above them.
    ###
    title: ${title}
    synopsis: ${synopsis}
    image description: 
    `,
    temperature: 0.8,
    max_tokens: 100

  })

  console.log(response.data.choices[0].text.trim())
  fetchImageUrl(response.data.choices[0].text.trim())
}


const fetchImageUrl = async (imagePrompt) => {

  try{
    const response = await openai.createImage({
      prompt: `${imagePrompt} The imaage should have no text or borderline`,
      size: '512x512',
      n: 1,
      response_format: 'url' 
    })

  }catch(error){
    console.error("Error fetching image URL:", error);
  }

  document.getElementById('output-img-container').innerHTML = `<img src="${response.data.data[0].b64_json}">`

  
}