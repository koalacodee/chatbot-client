# FAQsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getFAQsOfSharedDepartment**](#getfaqsofshareddepartment) | **GET** /department/shared/faqs | Get the FAQs of a shared department|
|[**getFAQsOfSharedDepartment_0**](#getfaqsofshareddepartment_0) | **GET** /department/shared/faqs | Get the FAQs of a shared department|
|[**getFAQsOfSubDepartmentOfSharedDepartment**](#getfaqsofsubdepartmentofshareddepartment) | **GET** /department/shared/sub-department/{subId}/faqs | Get FAQs of a Sub-Department of shared Department|
|[**getFAQsOfSubDepartmentOfSharedDepartment_0**](#getfaqsofsubdepartmentofshareddepartment_0) | **GET** /department/shared/sub-department/{subId}/faqs | Get FAQs of a Sub-Department of shared Department|
|[**recordDissatisfaction**](#recorddissatisfaction) | **POST** /BASE_URL/questions/dissatisfaction/{id} | Record Rating (Dissatisfaction)|
|[**recordDissatisfaction_0**](#recorddissatisfaction_0) | **POST** /BASE_URL/questions/dissatisfaction/{id} | Record Rating (Dissatisfaction)|
|[**recordSatisfaction**](#recordsatisfaction) | **POST** /BASE_URL/questions/satisfaction/{id} | Record Rating (Satisfaction)|
|[**recordSatisfaction_0**](#recordsatisfaction_0) | **POST** /BASE_URL/questions/satisfaction/{id} | Record Rating (Satisfaction)|
|[**viewAll**](#viewall) | **GET** /BASE_URL/questions/view | View All FAQs for a departmet/sub-department|
|[**viewAll_0**](#viewall_0) | **GET** /BASE_URL/questions/view | View All FAQs for a departmet/sub-department|
|[**viewFaq**](#viewfaq) | **POST** /BASE_URL/questions/view/{id} | View FAQ|
|[**viewFaq_0**](#viewfaq_0) | **POST** /BASE_URL/questions/view/{id} | View FAQ|

# **getFAQsOfSharedDepartment**
> GetFAQsOfSharedDepartment200Response getFAQsOfSharedDepartment()



### Example

```typescript
import {
    FAQsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FAQsApi(configuration);

let key: string; // (default to undefined)

const { status, data } = await apiInstance.getFAQsOfSharedDepartment(
    key
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **key** | [**string**] |  | defaults to undefined|


### Return type

**GetFAQsOfSharedDepartment200Response**

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

# **getFAQsOfSharedDepartment_0**
> GetFAQsOfSharedDepartment200Response getFAQsOfSharedDepartment_0()



### Example

```typescript
import {
    FAQsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FAQsApi(configuration);

let key: string; // (default to undefined)

const { status, data } = await apiInstance.getFAQsOfSharedDepartment_0(
    key
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **key** | [**string**] |  | defaults to undefined|


### Return type

**GetFAQsOfSharedDepartment200Response**

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

# **getFAQsOfSubDepartmentOfSharedDepartment**
> GetFAQsOfSubDepartmentOfSharedDepartment200Response getFAQsOfSubDepartmentOfSharedDepartment()



### Example

```typescript
import {
    FAQsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FAQsApi(configuration);

let subId: string; // (default to undefined)
let key: string; // (default to undefined)

const { status, data } = await apiInstance.getFAQsOfSubDepartmentOfSharedDepartment(
    subId,
    key
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subId** | [**string**] |  | defaults to undefined|
| **key** | [**string**] |  | defaults to undefined|


### Return type

**GetFAQsOfSubDepartmentOfSharedDepartment200Response**

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

# **getFAQsOfSubDepartmentOfSharedDepartment_0**
> GetFAQsOfSubDepartmentOfSharedDepartment200Response getFAQsOfSubDepartmentOfSharedDepartment_0()



### Example

```typescript
import {
    FAQsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FAQsApi(configuration);

let subId: string; // (default to undefined)
let key: string; // (default to undefined)

const { status, data } = await apiInstance.getFAQsOfSubDepartmentOfSharedDepartment_0(
    subId,
    key
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subId** | [**string**] |  | defaults to undefined|
| **key** | [**string**] |  | defaults to undefined|


### Return type

**GetFAQsOfSubDepartmentOfSharedDepartment200Response**

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

# **recordDissatisfaction**
> RecordSatisfaction201Response recordDissatisfaction()



### Example

```typescript
import {
    FAQsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FAQsApi(configuration);

let id: string; // (default to undefined)
let body: object; // (optional)

const { status, data } = await apiInstance.recordDissatisfaction(
    id,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**RecordSatisfaction201Response**

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

# **recordDissatisfaction_0**
> RecordSatisfaction201Response recordDissatisfaction_0()



### Example

```typescript
import {
    FAQsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FAQsApi(configuration);

let id: string; // (default to undefined)
let body: object; // (optional)

const { status, data } = await apiInstance.recordDissatisfaction_0(
    id,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**RecordSatisfaction201Response**

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

# **recordSatisfaction**
> RecordSatisfaction201Response recordSatisfaction()



### Example

```typescript
import {
    FAQsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FAQsApi(configuration);

let id: string; // (default to undefined)
let body: object; // (optional)

const { status, data } = await apiInstance.recordSatisfaction(
    id,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**RecordSatisfaction201Response**

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

# **recordSatisfaction_0**
> RecordSatisfaction201Response recordSatisfaction_0()



### Example

```typescript
import {
    FAQsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FAQsApi(configuration);

let id: string; // (default to undefined)
let body: object; // (optional)

const { status, data } = await apiInstance.recordSatisfaction_0(
    id,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**RecordSatisfaction201Response**

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

# **viewAll**
> ViewAll200Response viewAll()



### Example

```typescript
import {
    FAQsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FAQsApi(configuration);

let limit: string; // (optional) (default to undefined)
let page: string; // (optional) (default to undefined)
let departmentId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.viewAll(
    limit,
    page,
    departmentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**string**] |  | (optional) defaults to undefined|
| **departmentId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**ViewAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **viewAll_0**
> ViewAll200Response viewAll_0()



### Example

```typescript
import {
    FAQsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FAQsApi(configuration);

let limit: string; // (optional) (default to undefined)
let page: string; // (optional) (default to undefined)
let departmentId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.viewAll_0(
    limit,
    page,
    departmentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**string**] |  | (optional) defaults to undefined|
| **departmentId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**ViewAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **viewFaq**
> RecordSatisfaction201Response viewFaq()



### Example

```typescript
import {
    FAQsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FAQsApi(configuration);

let id: string; // (default to undefined)
let body: object; // (optional)

const { status, data } = await apiInstance.viewFaq(
    id,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**RecordSatisfaction201Response**

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

# **viewFaq_0**
> RecordSatisfaction201Response viewFaq_0()



### Example

```typescript
import {
    FAQsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FAQsApi(configuration);

let id: string; // (default to undefined)
let body: object; // (optional)

const { status, data } = await apiInstance.viewFaq_0(
    id,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**RecordSatisfaction201Response**

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

