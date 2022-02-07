import {useState, useEffect} from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import  Modal  from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'


function App() {

  const [data, setData] = useState([{}]);
  const [track, setTrackToDelete] = useState(0)

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

  return (
    <div>
      <Modal show={true}>
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
            </Form.Group>
          </Form>
        </Modal.Footer>
      </Modal>
    </div>
    
    // <div>
    //   {(typeof data.members === 'undefined') ? 
    //   (<p>Loading....</p>) : (
    //    data.members.map((member, i) =>(<p key={i}>{member}</p>)))
    //   }
    // </div>
  );
}

export default App;
