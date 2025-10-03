
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const stores = [
  {
    title: 'Miyapur',
    address: 'Miyapur Rd, Miyapur, Hyderabad, Telangana 500049',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.947948842519!2d77.2295093150825!3d28.6129124824198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2a992f5a7d5%3A0x742a5b1b1b1b1b1b!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1623456789012!5m2!1sen!2sin',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Miyapur,+Hyderabad'
  },
  {
    title: 'Khairtabad',
    address: 'Khairtabad, Hyderabad, Telangana 500004',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.843943502612!2d72.83407031478422!3d18.92198448719778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1cffffff000%3A0xf517c1f8f0a1e5a!2sGateway%20Of%20India%20Mumbai!5e0!3m2!1sen!2sin!4v1623456789012!5m2!1sen!2sin',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Khairtabad,+Hyderabad'
  },
  {
    title: 'Nampally',
    address: 'Nampally, Hyderabad, Telangana 500001',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.742437533438!2d78.04206851455196!3d27.175144782989097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39747121d702ff6d%3A0xdd2ae4803f767dde!2sTaj%20Mahal!5e0!3m2!1sen!2sin!4v1623456789012!5m2!1sen!2sin',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Nampally,+Hyderabad'
  },
  {
    title: 'Assembly',
    address: 'Public Gardens Rd, Nampally, Hyderabad, Telangana 500004',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.647542502612!2d72.82563331478422!3d18.94496448719778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c63066d3c7b1%3A0x4b3b0e5a5a5a5a5a!2sMarine%20Drive!5e0!3m2!1sen!2sin!4v1623456789012!5m2!1sen!2sin',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Telangana+State+Legislative+Assembly,+Hyderabad'
  },
  {
    title: 'Gachibowli',
    address: 'Gachibowli, Hyderabad, Telangana 500032',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.842137533438!2d88.34306851455196!3d22.575144782989097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f882dee4d4b7c1%3A0x4b3b0e5a5a5a5a5a!2sHowrah%20Bridge!5e0!3m2!1sen!2sin!4v1623456789012!5m2!1sen!2sin',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Gachibowli,+Hyderabad'
  },
  {
    title: 'Charminar',
    address: 'Charminar Rd, Charminar, Ghansi Bazaar, Hyderabad, Telangana 500002',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.042137533438!2d78.47406851455196!3d17.361144782989097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb77dbf8f5a4b1%3A0x4b3b0e5a5a5a5a5a!2sCharminar!5e0!3m2!1sen!2sin!4v1623456789012!5m2!1sen!2sin',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Charminar,+Hyderabad'
  },
];

const OurStoresPage: React.FC = () => {
  return (
    <section className="py-5">
      <Container>
        <h1 className="text-center mb-4">Our Stores</h1>
        <div className="maroon-line"></div>

        <Row className="store-row">
          {stores.map((store, index) => (
            <Col lg={4} md={6} className="store-card-wrapper" key={index}>
              <Card className="store-card">
                <div className="map-container">
                  <iframe
                    src={store.mapEmbed}
                    allowFullScreen={true}
                    loading="lazy"
                  ></iframe>
                </div>
                <Card.Body className="store-card-body">
                  <Card.Title className="store-card-title">{store.title}</Card.Title>
                  <Card.Text className="store-card-address">{store.address}</Card.Text>
                  <Button
                    variant="maroon"
                    href={store.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Find the store
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default OurStoresPage;
