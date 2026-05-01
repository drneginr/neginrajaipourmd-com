const { Client } = require('@hubspot/api-client');

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_API_KEY });

/**
 * Create or update contact in HubSpot
 * Returns contact ID
 */
async function createOrUpdateContact(email, properties) {
  try {
    // Search for existing contact by email
    const searchRequest = {
      filterGroups: [{
        filters: [{
          propertyName: 'email',
          operator: 'EQ',
          value: email
        }]
      }]
    };

    const searchResults = await hubspotClient.crm.contacts.searchApi.doSearch(searchRequest);

    if (searchResults.results && searchResults.results.length > 0) {
      // Update existing contact
      const contactId = searchResults.results[0].id;
      await hubspotClient.crm.contacts.basicApi.update(contactId, { properties });
      console.log(`Updated existing HubSpot contact: ${contactId}`);
      return contactId;
    } else {
      // Create new contact
      const newContact = await hubspotClient.crm.contacts.basicApi.create({
        properties: { ...properties, email }
      });
      console.log(`Created new HubSpot contact: ${newContact.id}`);
      return newContact.id;
    }
  } catch (error) {
    console.error('HubSpot contact creation error:', error);
    throw error;
  }
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { email, firstName, constraint, source } = data;

    if (!email || !firstName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and firstName are required' })
      };
    }

    // Map constraint internal ID to HubSpot enum value
    const constraintMap = {
      'demand': 'demand_generation',
      'positioning': 'positioning_differentiation',
      'capacity': 'capacity_operations',
      'team': 'team_delegation',
      'monetization': 'monetization_pricing',
      'systems': 'operational_systems'
    };

    const properties = {
      firstname: firstName,
      brand_of_origin: 'nrmd'
    };

    // Add source-specific properties
    if (source === 'diagnostic' && constraint) {
      properties.primary_constraint = constraintMap[constraint] || constraint;
      properties.diagnostic_submitted_date = new Date().toISOString().split('T')[0];
      properties.hs_lifecyclestage_subscriber_date = Date.now();
      properties.lifecyclestage = 'subscriber';
    } else if (source === 'inquiry') {
      const { phone, organization, role, inquiryType, message } = data;
      if (phone) properties.phone = phone;
      if (organization && role) properties.role_and_organization = `${role} at ${organization}`;
      properties.inquiry_submitted_date = new Date().toISOString().split('T')[0];
      properties.lifecyclestage = 'marketingqualifiedlead';

      // Store inquiry details in notes or custom field if available
      if (message) {
        // Note: HubSpot doesn't have a standard "inquiry message" field
        // You may need to create this custom property or use notes
      }
    }

    const contactId = await createOrUpdateContact(email, properties);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        contactId,
        message: 'Contact created/updated in HubSpot'
      })
    };

  } catch (error) {
    console.error('Error in HubSpot contact creation:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create/update contact in HubSpot',
        details: error.message
      })
    };
  }
};
