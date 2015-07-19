angular.module('oriApp')
  .factory('AdminService', function ($q, ItemsService, OrdersService, socket) {

    var AdminService = {
      items: {
        list: []
      },
      orders: {
        list: []
      },
      init: init,
      createItem: createItem,
      updateItem: updateItem,
      fetchItems: fetchItems,
      fetchOrders: fetchOrders,
      updateOrderStatus: updateOrderStatus,
      createOneItemOrder: createOneItemOrder
    };

    // listen to order save socket.io message
    socket.addEventHandler('orderCreated', function(msg) {
      AdminService.orders.list.push(msg.order);
      fetchItems();
    });

    return AdminService;

    /////////

    function createItem(itemData) {
      return ItemsService.createItem(itemData)
        .then(function(newItem) {
          AdminService.items.list.push(newItem);
        });
    }

    function updateItem(itemData) {
      return ItemsService.updateItem(itemData);
    }

    function fetchItems() {
      return ItemsService.fetchItems()
        .then(function(items) {
          AdminService.items.list = _.toArray(items);
        });
    }

    function fetchOrders() {
      return OrdersService.fetchOrders()
        .then(function(orders) {
          AdminService.orders.list = _.toArray(orders);
        });
    }

    function init() {
      var defer = $q.defer();

      fetchItems()
        .then(fetchOrders)
        .then(function() {

          //socket.syncUpdates('order', AdminService.orders.list, function(eventName, order, orders) {
          //  console.log('model updated', order, orders);
          //  //AdminService.orders.list.push(order);
          //});

          defer.resolve();
        })
        .catch(function() {
          defer.reject();
        });
    }

    function updateOrderStatus(order, newStatus) {
      return OrdersService.updateOrderStatus(order, newStatus)
        .then(function() {
          order.status = newStatus;
        })
    }

    function createOneItemOrder(item) {
      var order = {
        items:[{
          id: item._id,
          name: item.name,
          quantity: 1,
          itemPrice: item.price
        }],
        totalPrice: item.price
      };
      return OrdersService.createOrder(order)
        .then(fetchOrders)
        .then(fetchItems);
    }

  });
