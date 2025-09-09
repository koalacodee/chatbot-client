# SupportTicketsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**completeSupportTicketVerification**](#completesupportticketverification) | **POST** /BASE_URL/support-tickets/verify | Complete Support Ticket Verification|
|[**completeSupportTicketVerification_0**](#completesupportticketverification_0) | **POST** /BASE_URL/support-tickets/verify | Complete Support Ticket Verification|
|[**createSupportTicket**](#createsupportticket) | **POST** /BASE_URL/support-tickets | Create a new support ticket|
|[**createSupportTicket_0**](#createsupportticket_0) | **POST** /BASE_URL/support-tickets | Create a new support ticket|
|[**getTicketHistory**](#gettickethistory) | **GET** /BASE_URL/support-tickets/my-tickets | Get Ticket History|
|[**getTicketHistory_0**](#gettickethistory_0) | **GET** /BASE_URL/support-tickets/my-tickets | Get Ticket History|
|[**recordTicketDissatisfaction**](#recordticketdissatisfaction) | **POST** /BASE_URL/support-tickets/dissatisfaction/{id} | Record Ticket Interaction (Dissatisfaction)|
|[**recordTicketDissatisfaction_0**](#recordticketdissatisfaction_0) | **POST** /BASE_URL/support-tickets/dissatisfaction/{id} | Record Ticket Interaction (Dissatisfaction)|
|[**recordTicketSatisfaction**](#recordticketsatisfaction) | **POST** /BASE_URL/support-tickets/satisfaction/{id} | Record Ticket Interaction (Satisfaction)|
|[**recordTicketSatisfaction_0**](#recordticketsatisfaction_0) | **POST** /BASE_URL/support-tickets/satisfaction/{id} | Record Ticket Interaction (Satisfaction)|
|[**trackSupportTicket**](#tracksupportticket) | **GET** /BASE_URL/support-tickets/track/{code} | Track Support Ticket|
|[**trackSupportTicket_0**](#tracksupportticket_0) | **GET** /BASE_URL/support-tickets/track/{code} | Track Support Ticket|

# **completeSupportTicketVerification**
> CompleteSupportTicketVerification201Response completeSupportTicketVerification()



### Example

```typescript
import {
    SupportTicketsApi,
    Configuration,
    VerifyGuestRegistrationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportTicketsApi(configuration);

let verifyGuestRegistrationRequest: VerifyGuestRegistrationRequest; // (optional)

const { status, data } = await apiInstance.completeSupportTicketVerification(
    verifyGuestRegistrationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **verifyGuestRegistrationRequest** | **VerifyGuestRegistrationRequest**|  | |


### Return type

**CompleteSupportTicketVerification201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **completeSupportTicketVerification_0**
> CompleteSupportTicketVerification201Response completeSupportTicketVerification_0()



### Example

```typescript
import {
    SupportTicketsApi,
    Configuration,
    VerifyGuestRegistrationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportTicketsApi(configuration);

let verifyGuestRegistrationRequest: VerifyGuestRegistrationRequest; // (optional)

const { status, data } = await apiInstance.completeSupportTicketVerification_0(
    verifyGuestRegistrationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **verifyGuestRegistrationRequest** | **VerifyGuestRegistrationRequest**|  | |


### Return type

**CompleteSupportTicketVerification201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createSupportTicket**
> CreateSupportTicket201Response createSupportTicket()



### Example

```typescript
import {
    SupportTicketsApi,
    Configuration,
    CreateSupportTicketRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportTicketsApi(configuration);

let createSupportTicketRequest: CreateSupportTicketRequest; // (optional)

const { status, data } = await apiInstance.createSupportTicket(
    createSupportTicketRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createSupportTicketRequest** | **CreateSupportTicketRequest**|  | |


### Return type

**CreateSupportTicket201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createSupportTicket_0**
> CreateSupportTicket201Response createSupportTicket_0()



### Example

```typescript
import {
    SupportTicketsApi,
    Configuration,
    CreateSupportTicketRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportTicketsApi(configuration);

let createSupportTicketRequest: CreateSupportTicketRequest; // (optional)

const { status, data } = await apiInstance.createSupportTicket_0(
    createSupportTicketRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createSupportTicketRequest** | **CreateSupportTicketRequest**|  | |


### Return type

**CreateSupportTicket201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTicketHistory**
> GetTicketHistory200Response getTicketHistory()



### Example

```typescript
import {
    SupportTicketsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportTicketsApi(configuration);

let phone: string; // (default to undefined)

const { status, data } = await apiInstance.getTicketHistory(
    phone
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **phone** | [**string**] |  | defaults to undefined|


### Return type

**GetTicketHistory200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTicketHistory_0**
> GetTicketHistory200Response getTicketHistory_0()



### Example

```typescript
import {
    SupportTicketsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportTicketsApi(configuration);

let phone: string; // (default to undefined)

const { status, data } = await apiInstance.getTicketHistory_0(
    phone
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **phone** | [**string**] |  | defaults to undefined|


### Return type

**GetTicketHistory200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **recordTicketDissatisfaction**
> RecordSatisfaction201Response recordTicketDissatisfaction()



### Example

```typescript
import {
    SupportTicketsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportTicketsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.recordTicketDissatisfaction(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**RecordSatisfaction201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **recordTicketDissatisfaction_0**
> RecordSatisfaction201Response recordTicketDissatisfaction_0()



### Example

```typescript
import {
    SupportTicketsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportTicketsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.recordTicketDissatisfaction_0(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**RecordSatisfaction201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **recordTicketSatisfaction**
> RecordSatisfaction201Response recordTicketSatisfaction()



### Example

```typescript
import {
    SupportTicketsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportTicketsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.recordTicketSatisfaction(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**RecordSatisfaction201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **recordTicketSatisfaction_0**
> RecordSatisfaction201Response recordTicketSatisfaction_0()



### Example

```typescript
import {
    SupportTicketsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportTicketsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.recordTicketSatisfaction_0(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**RecordSatisfaction201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **trackSupportTicket**
> TrackSupportTicket200Response trackSupportTicket()



### Example

```typescript
import {
    SupportTicketsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportTicketsApi(configuration);

let code: string; // (default to undefined)
let body: object; // (optional)

const { status, data } = await apiInstance.trackSupportTicket(
    code,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |
| **code** | [**string**] |  | defaults to undefined|


### Return type

**TrackSupportTicket200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **trackSupportTicket_0**
> TrackSupportTicket200Response trackSupportTicket_0()



### Example

```typescript
import {
    SupportTicketsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupportTicketsApi(configuration);

let code: string; // (default to undefined)
let body: object; // (optional)

const { status, data } = await apiInstance.trackSupportTicket_0(
    code,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |
| **code** | [**string**] |  | defaults to undefined|


### Return type

**TrackSupportTicket200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

