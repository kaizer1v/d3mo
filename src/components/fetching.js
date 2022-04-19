import { csvParse } from 'd3'

/* Problem: Pyramid of doom */
// fetch(colours_url).then(resp => {
//   resp.text().then(text => {
//     console.log(text)
//   })
// })

/* Solution: async and await */
const fetch_colours = async (colours_url) => {
  const response = await fetch(colours_url)
  return await response.text()
}

const Colours = ({ url }) => {
  fetch_colours(url)
    .then(text => {
      console.log(csvParse(text))
    })
}


const App = () => (
  <>
    <h1>See the console</h1>

    <Colours url='https://gist.githubusercontent.com/curran/b236990081a24761f7000567094914e0/raw/acd2b8cecfe51c520622fbaf407ee88b8796bfc6/cssNamedColors.csv' />
  </>
)

export default App