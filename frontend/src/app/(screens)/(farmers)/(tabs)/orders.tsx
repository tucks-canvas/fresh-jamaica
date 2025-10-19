import React, { useState } from 'react';

/* Import React-Native Content */
import { View, Text, ScrollView, TouchableOpacity, Image, Animated, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* Import Icons, Colors, and Images */
import colors from '@/constants/colors';
import { icons, images } from '@/constants';

const statuses = [
  {
    id: 0,
    title: 'Preparing',
  },
  {
    id: 1,
    title: 'Finished',
  },
];

const sampleOrders = [
  {
    id: '1',
    status: 'New',
    date: new Date(),
    customer: 'Jane Doe',
    items: [
      { id: 'a', 
        title: 'Fresh Carrots', 
        quantity: 2, 
        price: 500, 
        image: images.freshcarrots 
      },
      { 
        id: 'b', 
        title: 'Sweet Peppers', 
        quantity: 1, 
        price: 400, 
        image: images.freshpeppers 
      },
    ],
    subtotal: 1400,
    delivery: 500,
    discount: 0,
    tax: 210,
    total: 2110,
  },
  {
    id: '2',
    status: 'New',
    date: new Date(),
    customer: 'John Smith',
    items: [
      { 
        id: 'c', 
        title: 'Fresh Ginger', 
        quantity: 3, 
        price: 300, 
        image: images.freshginger 
    },
    ],
    subtotal: 900,
    delivery: 500,
    discount: 0,
    tax: 135,
    total: 1535,
  },
];

const Orders = () => {
  const [orders, setOrders] = useState(sampleOrders);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [statusDropdownOrderId, setStatusDropdownOrderId] = useState(null);

  const toggleOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const markReady = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: 'Ready for Pickup' } : order
      )
    );
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />      

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headertext}>Orders</Text>
            </View>

            <View style={styles.body}>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TouchableOpacity
                    key={order.id}
                    style={styles.order}
                    activeOpacity={0.9}
                    onPress={() => toggleOrder(order.id)}
                  >
                    <View style={styles.orderhead}>
                      <View style={styles.orderleft}>
                        <TouchableOpacity 
                          onPress={() => setStatusDropdownOrderId(statusDropdownOrderId === order.id ? null : order.id)}
                        >
                          <Text style={styles.orderstatustext}>{order.status}</Text>
                        </TouchableOpacity>

                        <Text style={styles.orderdate}>{order.date.toLocaleString()}</Text>
                      </View>

                      <View style={styles.orderright}>
                        <Text style={styles.orderername}>{order.customer}</Text>

                        <Image
                          source={expandedOrderId === order.id ? icons.up : icons.down}
                          style={styles.icon}
                        />
                      </View>
                    </View>

                    {statusDropdownOrderId === order.id && (
                      <View style={styles.orderstatuses}>
                          {statuses.map((status) => (
                            <TouchableOpacity 
                              key={status.id} 
                              style={styles.orderstatus}
                              onPress={() => {
                                setOrders((prev) =>
                                  prev.map((o) =>
                                    o.id === order.id ? { ...o, status: status.title } : o
                                  )
                                );
                                setStatusDropdownOrderId(null);
                              }}
                            >
                              <Text style={styles.orderstatusubtext}>{status.title}</Text>
                            </TouchableOpacity>
                          ))}
                      </View>
                    )}

                    {expandedOrderId === order.id && (
                      <Animated.View style={styles.orderdetails}>
                        <View style={styles.orderinfo}>
                          {order.items.map((item) => (
                            <View 
                              key={item.id} 
                              style={styles.orderitem}
                            >
                              <View style={styles.orderhead}>
                                <Image 
                                  source={item.image} 
                                  style={styles.orderitemimage} 
                                />

                                <View style={styles.orderiteminfo}>
                                  <Text style={styles.orderitemtitle}>{item.title}</Text>
                                  <Text style={styles.orderitemqty}>Qty: {item.quantity}</Text>
                                </View>
                              </View>
                              
                              <Text style={styles.orderitemprice}>JMD ${item.price}</Text>
                            </View>
                          ))}
                        </View>
                        
                        <View style={styles.orderfooter}>
                          {order.status === 'New' || order.status === 'Preparing' || order.status === 'Finished' ? (

                            <TouchableOpacity
                              style={styles.orderbutton}
                              onPress={() => markReady(order.id)}
                            >
                              <Text style={styles.orderbuttontext}>Ready for Pickup</Text>
                            </TouchableOpacity>

                          ) : order.status === 'Ready for Pickup' ? (

                            <Text style={styles.ordernotice}>Waiting for pickup...</Text>

                          ) : null}

                          <Text style={styles.ordertotal}>JMD ${order.total}</Text>
                        </View>
                      </Animated.View>
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noorders}>No orders yet.</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    height: '100%',
    width: '100%',
  },

  scrollViewContent: {
    height: '100%',
    width: '100%',
    paddingBottom: 80,
    paddingTop: 20,
  },
  
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },

  /* Header */

  header: {
    width: '80%',
    height: 'auto',
    paddingVertical: 20,
    marginBottom: 5,
    alignItems: 'center',
  },

  headertext: { 
    fontFamily: 'Gilroy-Bold', 
    fontSize: 25, 
    color: colors.black 
  },

  /* Body */

  body: {
    width: '80%',
  },

  /* Order */

  order: {
    backgroundColor: colors.gallery,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },

  orderheader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  
  orderstatustext: { 
    fontFamily: 'Gilroy-Bold', 
    fontSize: 18, 
    color: colors.jewel 
  },
  
  orderdate: { 
    fontFamily: 'Gilroy-Medium', 
    fontSize: 13, 
    color: colors.dullGrey 
  },

  orderdetails: { 
    flexDirection: 'column',
    gap: 5,
    marginTop: 30,
  },

  orderername: { 
    fontFamily: 'Gilroy-Medium', 
    fontSize: 14, 
    color: colors.jewel, 
    marginTop: 2 
  },

  orderfooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 15
  },

  ordertotal: { 
    fontFamily: 'Gilroy-SemiBold', 
    fontSize: 22, 
    color: colors.black, 
  },
  
  noorders: { 
    textAlign: 'center', 
    fontFamily: 'Gilroy-Medium', 
    color: colors.dullGrey, 
    marginTop: 40 
  },

  orderbutton: {
    backgroundColor: colors.jewel,
    padding: 12,
    borderRadius: 15,
  },

  orderbuttontext: { 
    fontFamily: 'Gilroy-Bold', 
    fontSize: 10,
    color: colors.white 
  },

  ordernotice: { 
    fontFamily: 'Gilroy-Bold', 
    fontSize: 15,
    color: colors.charcoal 
  },

  orderitem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20, 
    marginTop: 20,
    justifyContent: 'space-between',

  },

  orderitemimage: { 
    width: 40, 
    height: 40, 
    borderRadius: 8, 
    marginRight: 10 
  },

  orderitemtitle: { 
    flex: 1, 
    fontFamily: 'Gilroy-Bold', 
    fontSize: 16, 
    color: colors.black 
  },

  orderitemqty: { 
    fontFamily: 'Gilroy-Medium', 
    fontSize: 14, 
    color: colors.dullGrey, 
  },

  orderhead: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
  },

  orderleft: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 15,
  },

  orderright: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    gap: 15,
  },

  orderitemprice: { 
    fontFamily: 'Gilroy-Medium', 
    fontSize: 14, 
    color: colors.black 
  },

  orderiteminfo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  orderstatuses: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },

  orderstatus: {
    padding: 10,
    borderRadius: 13,
    backgroundColor: colors.jewel,
  },

  orderstatusubtext: {
    fontFamily: 'Gilroy-Medium', 
    fontSize: 10, 
    color: colors.dullGrey,
  },

  orderinfo: {
    borderTopColor: colors.grey,
    borderTopWidth: 1,
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
  },

  /* Icons */

  icon: { 
    width: 20, 
    height: 20 
  },
});

export default Orders;