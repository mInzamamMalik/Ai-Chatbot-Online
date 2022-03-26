import logo from './logo.svg';
import './App.css';



const MediaCard = ({ title, body, imgUrl, isDark }) => (

  <div
    className={`mediaCard ${(isDark === true) ? "DarkModeClass" : "LightModeClass"}`}>

    <p> {(isDark === true) ? "Dark mode" : "Light mode"}  </p>

    <h2>{title}</h2>
    <p>{body}</p>
    <img width="200px" src={imgUrl} />

    <br />

    <button>Like</button>
    <button>Comment</button>
    <button>Share</button>
  </div>
)




function App() {
  return (
    <div>
      hello world

      <MediaCard
        title={"Media card 1"}
        body="some text of card"
        imgUrl="https://stimg.cardekho.com/images/carexteriorimages/930x620/Lamborghini/Aventador/6721/Lamborghini-Aventador-SVJ/1621849426405/front-left-side-47.jpg"
        isDark={true}
      />
      <MediaCard
        title={"Media card 2"}
        body="some text of card"
        imgUrl="https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&fit=crop"
        isDark={false}
      />
      <MediaCard
        title={"Media card 3"}
        body="some text of card"
        imgUrl="https://cdn.motor1.com/images/mgl/8e8Mo/s1/most-expensive-new-cars-ever.webp"
        isDark={true}
      />
      <MediaCard
        title={"Media card 4"}
        body="some text of card"
        imgUrl="https://upload.wikimedia.org/wikipedia/commons/2/25/2018_Toyota_Corolla_%28ZRE172R%29_Ascent_sedan_%282018-11-02%29_01.jpg"
        isDark={true}
      />

    </div>
  );
}

export default App;
