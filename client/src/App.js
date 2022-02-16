import { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'



function App() {

  const [data, setData] = useState([]);
  const [track, setTrackToDelete] = useState(0);
  const [artists, setArtists] = useState([{}]);
  const [info, setInfo] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [count, setCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false)

  async function reload() {
    await fetch("/playlist").then(res => res.json())
      .then(data => {
        setData(data)
        console.log(data);
      })
  }


  useEffect(() => {
    fetch("/search_genre_of_week").then(res => res.json())
      .then(info => {
        setInfo(info)
        console.log(info);
      })
  }, [])


  useEffect(() => {
    fetch("/playlist").then(res => res.json())
      .then(data => {
        setData(data)
        console.log(data)
      })
  }, [])

  useEffect(() => {
    const num = { count }
    fetch("/long_term_artists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(num)
    }).then(res => res.json())
      .then(artists => {
        setArtists(artists)
        console.log(artists.artists_list[0])
        console.log(artists.artists_images)
      })
  }, [])

  return (
    <Container className='custom-sizing' fluid>

      <Navbar bg='dark' variant='dark'>
        <Container>
          <Navbar.Brand color='white'>SpotifyNStuff</Navbar.Brand>
        </Container>

        <Button size='sm' variant='outline-light' onClick={() => { setShowModal(!showModal) }}>Click to display random playlist</Button>
      </Navbar>

      <section class="py-5 text-center container">
        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <h1 class="fw-light">Album example</h1>
            <p class="lead p-color">Based on your spotify informationa and data, enter a number to get some of my favorite artists of all time, from the last year, or last couple of weeks. Click the top button to get my current random playlist and feel free to add a track or delete a random track. These tracks came from songs that do not exist in my personal database.</p>
            <Row>
              <Button variant='dark' onClick={
                async () => {
                  const num = { count }
                  const response = await fetch("/long_term_artists", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(num)
                  }).then(res => res.json()
                    .then(artists => {
                      setArtists(artists)
                    }

                    ))
                  if (response.ok) {
                    console.log("yay")
                  }
                }
              }>Favorites Over The Years</Button>
              <Button style={{ marginTop: "10px" }} variant='dark' onClick={
                async () => {
                  const num = { count }
                  const response = await fetch("/medium_term_artists", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(num)
                  }).then(res => res.json()
                    .then(artists => {
                      setArtists(artists)
                    }

                    ))
                  if (response.ok) {

                  }
                }
              }>Favorites From Last Year</Button>
              <Button style={{ marginTop: "10px" }} variant='dark' onClick={
                async () => {
                  const num = { count }
                  const response = await fetch("/short_term_artists", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(num)
                  }).then(res => res.json()
                    .then(artists => {
                      setArtists(artists)
                    }

                    ))
                  if (response.ok) {
                    console.log("")
                  }
                }
              }>The last 4 weeks</Button>
              <Form style={{ marginTop: '10px' }}>
                <Form.Control placeholder='Enter a number to get a range of favorite artists. i.e(5)' type='number' value={count} onChange={e => setCount(e.target.value)}>

                </Form.Control>
              </Form>
            </Row>
          </div>
        </div>
      </section>
      <div className='album py-5'>
        <Container>
          {((typeof artists.artists_list === 'undefined') ? (<p>Loading</p>) : (
            <Row>
              {artists.artists_list.map((artist, i) =>
                <Col style={{ marginBottom: "10px " }} >
                  <Card text='white' bg='dark' style={{ width: '16rem' }} >
                    <Card.Body>
                      <Card.Img src={artists.artists_images[i]}></Card.Img>
                      <Card.Title>{artist}</Card.Title>
                      <Container>

                      </Container>
                    </Card.Body>
                  </Card>
                </Col>)}
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
          <Modal.Title>SpotifyNStuff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup as='ol' numbered>
            {(typeof data.members === 'undefined') ? (<p>Loading....</p>) :
              (data.members.map((member, i) => (<ListGroupItem as='li' key={i}>{member + " : " + data.artist_names[i]} </ListGroupItem>)))}
          </ListGroup>
          <Container>
            <iframe title='playlist' src="https://open.spotify.com/embed/playlist/0vWGvkCnbashwFP0gNCNN8?utm_source=generator" width="100%" height="80" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" sandbox='allow-same-origin allow-scripts allow-forms'></iframe>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Form>
            <Form.Group >
              <Form.Label>Song To Delete</Form.Label>
              <Form.Control placeholder='Input digits only.' type='number' value={track} onChange={e => setTrackToDelete(e.target.value)}></Form.Control>
              <Container>
                <Button onClick={async () => {
                  const songToDelete = { track }
                  console.log(track)
                  const response = await fetch("/removesong", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },

                    body: JSON.stringify(songToDelete)
                  })

                  if (!response.ok) {
                    setShowAlert(!showAlert)
                  }
                  else {
                    reload()
                  }
                }}>Delete this track</Button>
              </Container>
              <Container>
                <Button onClick={async () => {
                  const r = await fetch("/addsong")
                  if (r.ok) {
                    reload();
                  }
                }}>Click me to add a random song</Button>
              </Container>

            </Form.Group>
          </Form>
          <Container>
            <Alert show={showAlert} variant='danger'>
              <Alert.Heading>Lost Connection to Databse</Alert.Heading>
              <p>Please reload page</p>
            </Alert>
          </Container>
        </Modal.Footer>
      </Modal>
      <Container>
        <Container>
          <h3 style={{display: "flex", justifyContent: "center" }}>Top Genres Played Last Week</h3>
        </Container>

      </Container>
      <div>
        {(typeof info === 'undefined') ? (<p>true</p>) :
          <ListGroup variant="flush">
            {Object.keys(info).map((key, i) => (
              <ListGroup.Item className="d-flex justify-content-between align-items-start" variant='dark' key={i}>
                <div className="ms-2 me-auto">
                  <div className="fw-bold">
                    {key}
                  </div>

                </div>
                <Badge variant="primary" pill>
                  {info[key]}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        }

      </div>

    </Container>
  );
}

export default App;