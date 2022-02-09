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
  const [artists, setArtists] = useState([{}]);
  const [showModal, setShowModal] = useState(false);
  const [count, setCount] = useState(0);
 
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
    const num = {count}
    fetch("/long_term_artists", {
      method: "POST",
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify(num)
    }).then(res => res.json())
    .then(artists => {
      setArtists(artists)
      console.log(artists.artists_list[0])
      console.log(artists.artists_images)
    })
  },[])

  return (
    <main>
      <Container fluid>
        <Navbar bg='success' variant='dark'>
          <Navbar.Brand color='white'>SpotifyNStuff</Navbar.Brand>
          <Button variant='light' onClick={() =>{setShowModal(!showModal)}}>Click to display random playlist</Button>
        </Navbar>
      </Container>
      <section class="py-5 text-center container">
        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <h1 class="fw-light">Album example</h1>
            <p class="lead text-muted">Based on your spotify informationa and data, enter a number to get some of my favorite artists of all time, from the last year, or last couple of weeks. Click the top button to get my current random playlist and feel free to add a track or delete a random track. These tracks came from songs that do not exist in my personal database.</p>
          <Row> <Button variant='success' onClick={
                async () =>{
                  const num = {count}
                  const response = await fetch("/long_term_artists",{
                    method: "POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify(num)
                  } ).then(res => res.json()
                  .then(artists => {
                    setArtists(artists)
                  }
                  
                  ))
                  if(response.ok){
                    console.log("yay")
                  }
                }
              }>Favorites Over The Years</Button>
              <Button variant='success' onClick={
                async () =>{
                  const num = {count}
                  const response = await fetch("/medium_term_artists",{
                    method: "POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify(num)
                  } ).then(res => res.json()
                  .then(artists => {
                    setArtists(artists)
                  }
                  
                  ))
                  if(response.ok){
                    console.log("yay")
                  }
                }
              }>Favorites From Last Year</Button>
              <Button variant='success' onClick={
                async () =>{
                  const num = {count}
                  const response = await fetch("/short_term_artists",{
                    method: "POST",
                    headers:{"Content-Type": "application/json"},
                    body: JSON.stringify(num)
                  } ).then(res => res.json()
                  .then(artists => {
                    setArtists(artists)
                  }
                  
                  ))
                  if(response.ok){
                    console.log("yay")
                  }
                }
              }>The last 4 weeks</Button>
              <Form style={{marginTop: '10px'}}>
                <Form.Control placeholder='Enter a number to get a range of favorite artists. i.e(5)' type='number' value={count} onChange={e => setCount(e.target.value)}>

                </Form.Control>
              </Form>
           </Row>
         </div>
          </div>
      </section>
      <div className='album py-5 bg-light'>
      <Container>
      {((typeof artists.artists_list === 'undefined') ? (<p>Loading</p>):(
        <Row>
          {artists.artists_list.map((artist, i) => 
          <Col >
            <Card text='white' bg='success' style={{width: '16rem'}} >
            <Card.Body>
            <Card.Img src={artists.artists_images[i]}></Card.Img>
                <Card.Title>{artist}</Card.Title>
            </Card.Body>
            </Card>
          </Col>) }
        </Row>
      )
    )}
      </Container>
      </div>
   

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
                else{
                  console.log("bad boy")
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
  );
}

export default App;