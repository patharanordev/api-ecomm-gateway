let orders = [{
	"method":"create",
	"data": {
		"order_id": "1",
        "user_id": "UUID_ID_OF_USER_NOT_SOCIAL_ID",
        "payment": {
			"method": "visa",
			"card_id": "1234567890098765",
			"shipping": "Thai"
		},
        "items": [{
        	"product_id": "1",
        	"price": 650.3,
        	"qty": 1
        }, {
        	"product_id": "2",
        	"price": 1120.3,
        	"qty": 2
        }]
	}
}]