// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

//  This sample demonstrates how to list Assets and use Odata filters to find assets by date ranges
//  See the article https://docs.microsoft.com//azure/media-services/latest/filter-order-page-entities-how-to
//  for more details on how to filter, page and order lists of resources in Azure Media Services API. 

import { DefaultAzureCredential } from "@azure/identity";
import {
  AzureMediaServices
} from '@azure/arm-mediaservices';

// Load the .env file if it exists
import * as dotenv from "dotenv";
dotenv.config();

export async function main() {
  // Copy the samples.env file and rename it to .env first, then populate it's values with the values obtained 
  // from your Media Services account's API Access page in the Azure portal.
  const subscriptionId: string = process.env.AZURE_SUBSCRIPTION_ID as string;
  const resourceGroup: string = process.env.AZURE_RESOURCE_GROUP as string;
  const accountName: string = process.env.AZURE_MEDIA_SERVICES_ACCOUNT_NAME as string;


  // This sample uses the default Azure Credential object, which relies on the environment variable settings.
  // If you wish to use User assigned managed identity, see the samples for v2 of @azure/identity
  // Managed identity authentication is supported via either the DefaultAzureCredential or the ManagedIdentityCredential classes
  // https://docs.microsoft.com/javascript/api/overview/azure/identity-readme?view=azure-node-latest
  // See the following examples for how to authenticate in Azure with managed identity
  // https://github.com/Azure/azure-sdk-for-js/blob/@azure/identity_2.0.1/sdk/identity/identity/samples/AzureIdentityExamples.md#authenticating-in-azure-with-managed-identity 

  // const credential = new ManagedIdentityCredential("<USER_ASSIGNED_MANAGED_IDENTITY_CLIENT_ID>");
  const credential = new DefaultAzureCredential();

  let mediaServicesClient =  new AzureMediaServices(credential, subscriptionId)

  // List streaming locators in Account
  console.log("Listing streaming locators in account:")

  // For details on how to use filters, ordering and paging see the article https://docs.microsoft.com/azure/media-services/latest/filter-order-page-entities-how-to

  let locatorNames: string[]  = [];

  let filterOdata = "properties/created gt 2022-01-01T12:00:00Z";
  for await (const locator of mediaServicesClient.streamingLocators.list(resourceGroup, accountName, 
    { 
      filter : filterOdata,
      orderby : "properties/created asc"
    })){
    
    if (locator.name){
      locatorNames.push(locator.name);
      console.log(locator.name);
    }
  }

  // Find a locator by name, in this case, just that first one in the array above.
  let findByName = `name eq ${locatorNames[0]}`;

  for await (const locator of mediaServicesClient.streamingLocators.list(resourceGroup, accountName, 
    { 
      filter : filterOdata
    })){
    console.log(`Found the locator: ${locator.name}`);
  }

}

main().catch((err) => {
    
  console.error("Error running sample:", err.message);
  console.error (`Error code: ${err.code}`);

  if (err.name == 'RestError'){
      // REST API Error message
      console.error("Error request:\n\n", err.request);
  }

});