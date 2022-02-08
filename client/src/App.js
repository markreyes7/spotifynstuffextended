import {useState, useEffect} from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import  Modal  from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'


function App() {

  const [data, setData] = useState([]);
  const [track, setTrackToDelete] = useState(0);
  const [artists, setArtists] = useState([]);
  const [showModal, setShowModal] = useState(false);
 

  async function reload(){
   await fetch("/playlist").then(res =>res.json())
   .then(data =>{
     setData(data)
     console.log(data);
   })
  }

  

  useEffect(() => {
    fetch("/playlist").then(res => res.json())
    .then(data => {
      setData(data)
      console.log(data)
    })
  },[] )

  useEffect(() =>{
    fetch("/long_term_artists").then(res => res.json())
    .then(artists => {
      setArtists(artists)
      console.log(artists.artists_list[0])
      console.log(artists.artists_images)
    })
  },[])

  return (
    <main>
      <Container>
        <Navbar bg='light'>
          <Navbar.Brand>SpotifyNStuff</Navbar.Brand>
          <Button onClick={() =>{setShowModal(!showModal)}}>Click to display random playlist</Button>
        </Navbar>
      </Container>
      <section class="py-5 text-center container">
        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <h1 class="fw-light">Album example</h1>
            <p class="lead text-muted">Something short and leading about the collection below—its contents, the creator, etc. Make it short and sweet, but not too short so folks don’t simply skip over it entirely.</p>
          <p> <Button onClick={ async () =>{
                const response = await fetch("/long_term_artists").then(res => res.json()
                .then(artists => {
                  setArtists(artists)
                }
                
                ))
                if(response.ok){
                  console.log("yay")
                }
              }}>Favorites Over The Years</Button>
              <Button onClick={ async () =>{
                const response = await fetch("/medium_term_artists").then(res => res.json()
                .then(artists => {
                  setArtists(artists)
                }
                
                ))
                if(response.ok){
                  console.log("yay")
                }
              }}>Favorites From Last Year</Button>
              <Button onClick={
                async () =>{
                  const response = await fetch("/short_term_artists").then(res => res.json()
                  .then(artists => {
                    setArtists(artists)
                  }
                  
                  ))
                  if(response.ok){
                    console.log("yay")
                  }
                }
              }>The last 4 weeks</Button>
           </p>
         </div>
          </div>
      </section>
    {((typeof artists.artists_list === 'undefined') ? (<p>Loading</p>):(
      <Container>
        <Row>
      
        <Col>
          <Card style={{width: '18rem'}}>
            <Card.Img src={artists.artists_images[0]}></Card.Img>
              <Card.Body>
                <Card.Title>{artists.artists_list[0]}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        
        <Col>
          <Card style={{width: '18rem'}}>
            <Card.Img src={artists.artists_images[1]}></Card.Img>
              <Card.Body>
                <Card.Title>{artists.artists_list[1]}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      
      </Row>
      <Row>
      <Col>
          <Card style={{width: '18rem'}}>
            <Card.Img src={artists.artists_images[2]}></Card.Img>
              <Card.Body>
                <Card.Title>{artists.artists_list[2]}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        
        <Col>
          <Card style={{width: '18rem'}}>
            <Card.Img src={artists.artists_images[3]}></Card.Img>
              <Card.Body>
                <Card.Title>{artists.artists_list[3]}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        
        <Col>
          <Card style={{width: '18rem'}}>
            <Card.Img src={artists.artists_images[4]}></Card.Img>
              <Card.Body>
                <Card.Title>{artists.artists_list[4]}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Container>
    )
    )}

      <Modal show={showModal} onHide={async () => {
        await fetch("/close_connection_cursor")
        
        setShowModal(!showModal);
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Remove a song</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup numbered={true}>
            {(typeof data.members === 'undefined') ? (<p>Loading....</p>) :
            (data.members.map((member, i) => (<ListGroupItem key={i}>{member}</ListGroupItem>)))}
          </ListGroup>
        </Modal.Body>
        
        <Modal.Footer>
          <Form>
            <Form.Group >
              <Form.Label>Song To Delete</Form.Label>
              <Form.Control placeholder='Input digits only.' type='number' value={track} onChange={e => setTrackToDelete(e.target.value)}></Form.Control>
              <Container>
              <Button onClick={async () => {
                const songToDelete = {track}
                console.log(track)
                const response = await fetch("/removesong", {
                  method: "POST",
                  headers:{
                    "Content-Type": "application/json"
                  },
                  
                  body: JSON.stringify(songToDelete)
                })
              
                if (response.ok){
                  console.log("loading the current playlist")
                  reload();
                }
              }}>Delete this track</Button>
              </Container>
              <Container>
                <Button onClick={ async () =>{
                 const r = await fetch("/addsong")
                if(r.ok){
                  reload();
                }
                }}>Click me to add a random song</Button>
              </Container>
              
            </Form.Group>
          </Form>
        </Modal.Footer>
      </Modal>
    </main>
    
   /* <div className='container-fluid'>
       <ListGroup>
         {(typeof artists.artists_list === 'undefined') ? (<Spinner animation='border' role="status">Loading</Spinner>) :
          (artists.artists_list.map((artist, i) =>(<ListGroupItem key={i}>{artist}</ListGroupItem>) ))}
       </ListGroup>
      </div> */
  );
}

export default App;
