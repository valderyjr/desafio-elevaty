## Uso da API

### Usuários

1. Listar usuários

```sh
// skip = Parâmetro obrigatório que define quantos usuários serão pulados.
// take = Parâmetro obrigatório que define quantos usuários serão retornados.


curl --request GET \
    --url http://localhost:4000/api/users?skip=0&take=20
```

2. Listar usuário por ID

```sh
curl --request GET \
    --url http://localhost:4000/api/users/{userId}
```

3. Criar usuários

```sh
// firstName = Parâmetro obrigatório.
// lastName = Parâmetro obrigatório.
// email = Parâmetro obrigatório.
// birthDate = Parâmetro obrigatório de formato YYYY-MM-DD

curl --request POST \
    --url http://localhost:4000/api/users/ \
    --header 'Content-Type: application/json' \
    --data '{
        "firstName": "nome",
        "lastName": "sobrenome",
        "email":"email_usuario@mail.com",
        "birthDate": "2023-11-14"
    }'
```

4. Atualizar usuários

```sh
curl --request PATCH \
    --url http://localhost:4000/api/users/{userId} \
    --header 'Content-Type: application/json' \
    --data '{
        "firstName": "novo nome"
    }'
```

5. Deletar usuários

```sh
curl --request DELETE \
    --url http://localhost:4000/api/users/{userId}
```

### Telefones

1. Listar telefones

```sh
curl --request GET \
    --url http://localhost:4000/api/phones
```

2. Listar telefone por ID do usuário

```sh
curl --request GET \
    --url http://localhost:4000/api/phones/{userId}
```

3. Criar telefone

```sh
// countryCode: Parâmetro obrigatório.
// number: Parâmetro obrigatório.
// userId: Parâmetro obrigatório que associa o telefone ao usuário.

curl --request POST \
    --url http://localhost:4000/api/phones \
    --header 'Content-Type: application/json' \
    --data '{
    	"countryCode": "BR",
    	"userId": "0b89b920-8037-4203-a6bb-fcd8baca466e",
    	"number": "(99) 99999-9999"
    }'
```

4. Atualizar telefone

```sh
curl --request PATCH \
      --url http://localhost:4000/api/phones/{phoneId} \
      --header 'Content-Type: application/json' \
      --data '{
    	"countryCode": "AR"
        }'
```

5. Deletar telefone

```sh
curl --request DELETE \
    --url http://localhost:4000/api/phones/{userId}
```

### Endereços

1. Listar endereços

```sh
curl --request GET \
    --url http://localhost:4000/api/addresses
```

2. Listar endereço por ID do usuário

```sh
curl --request GET \
    --url http://localhost:4000/api/addresses/{userId}
```

3. Criar endereço

```sh
// zipCode: Parâmetro obrigatório.
// city: Parâmetro obrigatório.
// street: Parâmetro obrigatório.
// neighborhood: Parâmetro obrigatório.
// number: Parâmetro obrigatório.
// state: Parâmetro obrigatório de apenas dois dígitos referenciando a UF do estado.
// complement: Parâmetro opcional.
// userId: Parâmetro obrigatório que associa o endereço ao usuário.

curl --request POST \
    --url http://localhost:4000/api/addresses \
    --header 'Content-Type: application/json' \
    --data '{
    	"zipCode": "65900-510",
	    "city": "Imperatriz",
	    "street": "Rua paraiba",
	    "neighborhood": "Jucara",
	    "number": "120",
	    "state": "ma",
	    "userId": "401548ac-8de2-4422-b383-3f4665c144bd"
    }'
```

4. Atualizar endereço

```sh
curl --request PATCH \
      --url http://localhost:4000/api/addresses/{addressId} \
      --header 'Content-Type: application/json' \
      --data '{
    	"complement": "123"
        }'
```

5. Deletar endereço

```sh
curl --request DELETE \
    --url http://localhost:4000/api/addresses/{addressId}
```

### Cartões de crédito

1. Listar cartões de crédito

```sh
curl --request GET \
    --url http://localhost:4000/api/credit-cards
```

2. Listar cartão de crédito por ID do usuário

```sh
curl --request GET \
    --url http://localhost:4000/api/credit-cards/{userId}
```

3. Criar cartão de crédito

```sh
// brand: Parâmetro obrigatório.
// expirationMonth: Parâmetro obrigatório que vai de 0 a 11.
// expirationYear: Parâmetro obrigatório.
// number: Parâmetro obrigatório que valida se o número de fato é um cartão de crédito.
// userId: Parâmetro obrigatório que associa o cartão de crédito ao usuário.

curl --request POST \
    --url http://localhost:4000/api/credit-cards \
    --header 'Content-Type: application/json' \
    --data '{
        "brand": "Visa",
	    "expirationMonth": 11,
	    "expirationYear": 2023,
	    "userId": "1be9e3cb-ffb1-45fb-955f-d68b0d3b25fd",
	    "number": "400236124100882X6"
    }'
```

4. Atualizar cartão de crédito

```sh
curl --request PATCH \
      --url http://localhost:4000/api/credit-cards/{creditCardId} \
      --header 'Content-Type: application/json' \
      --data '{
            "brand": "Mastercard"
        }'
```

5. Deletar cartão de crédito

```sh
curl --request DELETE \
    --url http://localhost:4000/api/credit-cards/{creditCardId}
```

5. Gerar fatura do cartão de crédito

```sh
curl --request GET \
    --url http://localhost:4000/api/credit-cards/invoice/47a9b6bf-891b-402f-9722-0aa3be3e0a2f \
    --header 'Content-Disposition: attachment' \
    --header 'Content-Type: application/pdf'
```
