import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartScreen = () => {
    const navigate = useNavigate();

    const { id: productId } = useParams();

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchProductAndAdd = async () => {
            if (productId) {
                const { data } = await axios.get(`/api/products/${productId}`);
                const item = {
                    product: data._id,
                    name: data.name,
                    image: data.image,
                    price: data.price,
                    countInStock: data.countInStock,
                    qty: 1
                };

                const existingItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                const updatedItems = [...existingItems.filter(i => i.product !== productId), item];

                localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                setCartItems(updatedItems);
            }
        };

        fetchProductAndAdd();
    }, [productId]);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(items);
    }, []);

    const removeFromCartHandler = (id) => {
        const updated = cartItems.filter(item => item.product !== id);
        localStorage.setItem('cartItems', JSON.stringify(updated));
        setCartItems(updated);
    };
    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const userToken = JSON.parse(localStorage.getItem('userInfo'))?.token;
    if (!userToken) {
        navigate('/login');
        return;
    }

    const proceedToCheckout = () => {
        navigate('/checkout');
    };



    return (
        <Row>
            <Col md={8}>
                <h2>Shopping Cart</h2>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty <Link to="/">Go Back</Link></p>
                ) : (
                    <ListGroup variant="flush">
                        {cartItems.map(item => (
                            <ListGroup.Item key={item.product}>
                                <Row className="align-items-center">
                                    <Col md={2}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                                    <Col md={3}><Link to={`/product/${item.product}`}>{item.name}</Link></Col>
                                    <Col md={2}>${item.price}</Col>
                                    <Col md={2}>
                                        <Form.Select
                                            value={item.qty}
                                            onChange={(e) => {
                                                const newQty = Number(e.target.value);
                                                const updated = cartItems.map(i =>
                                                    i.product === item.product ? { ...i, qty: newQty } : i
                                                );
                                                localStorage.setItem('cartItems', JSON.stringify(updated));
                                                setCartItems(updated);
                                            }}
                                        >
                                            {[...Array(item.countInStock).keys()].map(x => (
                                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col md={2}>
                                        <Button variant="danger" onClick={() => removeFromCartHandler(item.product)}>
                                            Remove
                                        </Button>

                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h4>Cart Summary</h4>
                            <ListGroup variant="flush">
                                {cartItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col xs={6}>
                                                <strong>{item.name}</strong>
                                            </Col>
                                            <Col xs={3}>
                                                {item.qty} × ${item.price.toFixed(2)}
                                            </Col>
                                            <Col xs={3} className="text-end">
                                                <strong>${(item.qty * item.price).toFixed(2)}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <hr />
                            <h5 className="text-end">
                                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items):{" "}
                                <strong>
                                    ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                                </strong>
                            </h5>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button className="btn-block w-100" onClick={proceedToCheckout} disabled={cartItems.length === 0}>
                                Proceed To Checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>


        </Row>
    );
};

export default CartScreen;
