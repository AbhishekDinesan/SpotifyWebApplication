import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import {useState, useEffect} from 'react';

const CLIENT_ID = "389741d3f908407b8bdf61efcbd5fd51";
const CLIENT_SECRET = "2a9a90b89ab64086a6a651f0fc67f46f";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => { // function only runs once
    //API Access Token, all from docs
   var authParameters = {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
   }

    fetch('https://accounts.spotify.com/api/token', authParameters ) // rules for request
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])

  // Search

  async function search(){ // you want each fetch statement to wait its turn
    console.log("Search for " + searchInput);
    //Get request using search to get the Artist ID
    var searchParameters = {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json' , 
        'Authorization': 'Bearer ' + accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput +'&type=artist', searchParameters)
    //artistID will give you all relevant search inputs in a way
    .then(response => response.json())
    .then (data => {return data.artists.items[0].id}) // access the first query, and its associated artist ID

    console.log(artistID);
    
    
    //.then(data => console.log(data)) // this returns the object with all relevant seach quariers
    //Get Request with Artist ID to grab all albums fro martist
    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAlbums(data.items);

      });

    //Display those albums to the user
  }

  console.log(albums);
  return (
    <div className="App">
      <Container>
        <InputGroup className = "mb-3" size = "lg">
          <FormControl
            placeholder = "Search for Artist"
            type = "input"
            onKeyPress = {event => {
              if (event.key == "Enter")
              {
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
            />
            <Button onClick = {search}>
            Search
            </Button>
        </InputGroup>
      </Container>


      <Container>
        <Row className = "mx-2 row row-cols-4">
          {albums.map( (album, i) => {
            console.log(album);
            return (
            <Card>
              <Card.Img src = {album.images[0].url} />
              <Card.Body>
                <Card.Title>{album.name}</Card.Title>
            </Card.Body>
            </Card>
            )

          })}
        
        </Row>     
      </Container>
      
    </div>
  );
}

export default App;
