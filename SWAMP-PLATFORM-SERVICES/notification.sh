URL=$1

curl $URL -v -s -S --header 'Content-Type: application/json; charset=utf-8' --header 'Accept: application/json' --header "Fiware-Service: qsg" --header "Fiware-ServicePath: test" -d @- <<EOF
{
    "subscriptionId": "51c0ac9ed714fb3b37d7d5a8",
    "data": [{
        "temperature": {
            "type": "Float",
            "value": 29.73,
            "metadata": {}
        },
        "type": "Room",
        "id": "Room1"
    }]
}
EOF