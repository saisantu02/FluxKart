# FluxKart: Identity Reconciliation 

## About:

Meet the brilliant yet eccentric Dr. Emmett Brown, better known as Doc. Hopelessly stuck in 2023, he is fixing his time machine to go back to the future and save his friend. His favourite online store FluxKart.com sells all the parts required to build this contraption. As crazy as he might get at times, Doc surely knows how to be careful. To avoid drawing attention to his grandiose project, Doc is using different email addresses and phone numbers for each purchase.

FluxKart.com is deadpan serious about their customer experience. There is nothing more important than rewarding their loyal customers and giving a personalised experience. To do this, FluxKart decides to integrate Bitespeed into their platform. Bitespeed collects contact details from shoppers for a personalised customer experience. 

However, given Doc's modus operandi, Bitespeed faces a unique challenge: linking different orders made with different contact information to the same person.

We identify and keep track of a customer's identity across multiple purchases throudh this applicatin 

## Exposed endpoints

1. '/'             -> Sample test page return status code and a message for testing.
2. '/contacts'     -> To list all the contacts in the table.
3. '/contacts/:id' -> To list the contact with particular id.
4. '/identify'     -> To add a contact into table which return a JSON object as response.

## Database details:

A RDS MySQL database hosted in AWS is connected to the application
Database name: Fluxkart
Table name: Contact

## Deployment:

Hosted on AWS fargate.

## Local Deploymnet:

1. Clone the repostory
