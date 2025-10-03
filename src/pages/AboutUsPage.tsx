
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutUsPage: React.FC = () => {
  return (
    <Container className="mt-5 mb-5" style={{ minHeight: '60vh' }}>
      <h1 className="text-center">About Us</h1>
      <p className="text-start">
        Welcome to AreKatika Meat App, your trusted partner for fresh, hygienic, and premium-quality mutton. We go beyond just delivering products — we ensure every cut meets the highest standards of safety, taste, and nutrition. Our mission is to combine tradition with modern practices, offering responsibly sourced mutton that is carefully processed and delivered with care.
        <br /><br />
        With a strong focus on quality assurance, timely delivery, and customer trust, AreKatika Meat App has become a reliable choice for households, restaurants, and bulk buyers. Every order is handled with precision, right from sourcing to packaging, so that you and your family can enjoy the best meat experience every single time.
        <br /><br />
        Thank you for choosing us and being part of the AreKatika family — where freshness, quality, and trust come first!
      </p>

      <Row className="justify-content-center mb-5">
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Img variant="top" src="/assets/about01.jpg" style={{ height: '220px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
            <Card.Body className="py-4">
              <h5 className="fw-bold" style={{ color: 'maroon' }}>Premium Quality</h5>
              <p className="text-secondary">Handpicked cuts for the best taste and nutrition, delivered fresh to your doorstep.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Img variant="top" src="/assets/about02.jpg" style={{ height: '220px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
            <Card.Body className="py-4">
              <h5 className="fw-bold" style={{ color: 'maroon' }}>Hygienic Processing</h5>
              <p className="text-secondary">Modern facilities and strict standards ensure every order is safe and clean.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Img variant="top" src="/assets/about03.jpg" style={{ height: '220px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
            <Card.Body className="py-4">
              <h5 className="fw-bold" style={{ color: 'maroon' }}>Customer Trust</h5>
              <p className="text-secondary">Thousands of families and restaurants rely on AreKatika for quality and service.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="text-center">Our Story</h2>
      <p className="text-start">
        Founded with a deep passion for quality and service, AreKatika Meat App was established to bring premium mutton directly from trusted sources to our customers. What started as a small initiative has now grown into a recognized name in the meat industry, built on values of honesty, consistency, and customer-first service.
        <br />By combining traditional practices with modern processing and delivery systems, we are able to provide our customers with not just meat, but an experience they can trust.
        <br />Our journey is driven by a simple yet powerful belief — that every household deserves access to safe, nutritious, and high-quality mutton. As we continue to grow, our focus remains on expanding our reach, empowering local communities, and delivering excellence with every order.
      </p>
      <h2 className="text-center">Company Statutory Profile</h2>
      <div>
        <p className="text-start"><strong>Full Name:</strong> Arekatika Meat Udyog Limited (AMUL)</p>
        <p className="text-start"><strong>Company Type:</strong> Public Limited Company (Limited by Shares)</p>
        <p className="text-start"><strong>Date of Incorporation:</strong> 18th August 2025</p>
        <p className="text-start"><strong>CIN:</strong> U01441TS2025PLC202399</p>
        <p className="text-start"><strong>Business Classification:</strong> Sheep & Goat Farming</p>
      </div>

      <h2 className="text-center">Board of Directors & Promoters</h2>
      <Row className="justify-content-center" style={{ marginBottom: '2rem' }}>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Body className="py-4">
              <h5 className="fw-bold mb-2" style={{ color: 'maroon' }}>Mr. Sanjay Raj Jamalpur</h5>
              <p className="mb-0 text-secondary">Director & Promoter</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Body className="py-4">
              <h5 className="fw-bold mb-2" style={{ color: 'maroon' }}>Mr. Pavan Raj Shri Jamalpur</h5>
              <p className="mb-0 text-secondary">Director & Promoter</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Body className="py-4">
              <h5 className="fw-bold mb-2" style={{ color: 'maroon' }}>Ms. Neelima Jamalpur</h5>
              <p className="mb-0 text-secondary">Director & Promoter</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Body className="py-4">
              <h5 className="fw-bold mb-2" style={{ color: 'maroon' }}>Mr. Chandra Sekhar Nizamkari</h5>
              <p className="mb-0 text-secondary">Director & Promoter</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Body className="py-4">
              <h5 className="fw-bold mb-2" style={{ color: 'maroon' }}>Ms. Anita Palangthod</h5>
              <p className="mb-0 text-secondary">Director & Promoter</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Body className="py-4">
              <h5 className="fw-bold mb-2" style={{ color: 'maroon' }}>Ms. Reshmitha Raj Jamalpur</h5>
              <p className="mb-0 text-secondary">Director & Promoter</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Body className="py-4">
              <h5 className="fw-bold mb-2" style={{ color: 'maroon' }}>Mr. Shlok Raj Jamalpur</h5>
              <p className="mb-0 text-secondary">Director & Promoter</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="text-center">Our Objectives</h2>
      <Row className="justify-content-center" style={{ marginBottom: '2rem' }}>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Img variant="top" src="/assets/obj01.png" style={{ height: '160px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
            <Card.Body className="py-4">
              <p className="fw-bold mb-0" style={{ color: 'maroon' }}>Sheep & goat rearing, breeding, slaughtering, and processing.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Img variant="top" src="/assets/obj02.png" style={{ height: '160px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
            <Card.Body className="py-4">
              <p className="fw-bold mb-0" style={{ color: 'maroon' }}>Establishment of modern meat processing facilities in Telangana.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Img variant="top" src="/assets/obj03.png" style={{ height: '160px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
            <Card.Body className="py-4">
              <p className="fw-bold mb-0" style={{ color: 'maroon' }}>Adoption of AI-driven quality systems.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Img variant="top" src="/assets/obj05.png" style={{ height: '160px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
            <Card.Body className="py-4">
              <p className="fw-bold mb-0" style={{ color: 'maroon' }}>Value-added products: ready-to-cook, casings, leather, etc.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Img variant="top" src="/assets/obj04.png" style={{ height: '160px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
            <Card.Body className="py-4">
              <p className="fw-bold mb-0" style={{ color: 'maroon' }}>Training & empowerment of the Arekatika community.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Img variant="top" src="/assets/obj06.jpg" style={{ height: '160px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
            <Card.Body className="py-4">
              <p className="fw-bold mb-0" style={{ color: 'maroon' }}>Expansion to urban markets and exports (UAE, Iran, Jordan).</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Img variant="top" src="/assets/obj07.webp" style={{ height: '160px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
            <Card.Body className="py-4">
              <p className="fw-bold mb-0" style={{ color: 'maroon' }}>Eco-friendly waste management.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} lg={3} className="mb-4">
          <Card className="shadow-sm h-100 text-center border-0" style={{ borderRadius: '16px' }}>
            <Card.Img variant="top" src="/assets/obj08.png" style={{ height: '160px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
            <Card.Body className="py-4">
              <p className="fw-bold mb-0" style={{ color: 'maroon' }}>Partnerships with APEDA, MOFPI, NMRI, AIIMS Hyderabad.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="text-center">Contact Us</h2>
      <p className="text-start">Email: arekatika@gmail.com<br />Phone: +91 98765 43210</p>
    </Container>
  );
};

export default AboutUsPage;
