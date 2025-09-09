# DepartmentsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getSubDepartmentsForSharedDepartment**](#getsubdepartmentsforshareddepartment) | **GET** /department/shared/sub-departments | Get the sub-departments of a shared department|
|[**getSubDepartmentsForSharedDepartment_0**](#getsubdepartmentsforshareddepartment_0) | **GET** /department/shared/sub-departments | Get the sub-departments of a shared department|
|[**viewAllMainDepartments**](#viewallmaindepartments) | **GET** /BASE_URL/department/view/main | View All Main Departments|
|[**viewAllMainDepartments_0**](#viewallmaindepartments_0) | **GET** /BASE_URL/department/view/main | View All Main Departments|
|[**viewAllSubDepartments**](#viewallsubdepartments) | **GET** /BASE_URL/department/view/sub | View All Sub-Departments|
|[**viewAllSubDepartments_0**](#viewallsubdepartments_0) | **GET** /BASE_URL/department/view/sub | View All Sub-Departments|

# **getSubDepartmentsForSharedDepartment**
> ViewAllMainDepartments200Response getSubDepartmentsForSharedDepartment()



### Example

```typescript
import {
    DepartmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DepartmentsApi(configuration);

let key: string; // (default to undefined)

const { status, data } = await apiInstance.getSubDepartmentsForSharedDepartment(
    key
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **key** | [**string**] |  | defaults to undefined|


### Return type

**ViewAllMainDepartments200Response**

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

# **getSubDepartmentsForSharedDepartment_0**
> ViewAllMainDepartments200Response getSubDepartmentsForSharedDepartment_0()



### Example

```typescript
import {
    DepartmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DepartmentsApi(configuration);

let key: string; // (default to undefined)

const { status, data } = await apiInstance.getSubDepartmentsForSharedDepartment_0(
    key
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **key** | [**string**] |  | defaults to undefined|


### Return type

**ViewAllMainDepartments200Response**

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

# **viewAllMainDepartments**
> ViewAllMainDepartments200Response viewAllMainDepartments()



### Example

```typescript
import {
    DepartmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DepartmentsApi(configuration);

let limit: string; // (optional) (default to undefined)
let page: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.viewAllMainDepartments(
    limit,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**string**] |  | (optional) defaults to undefined|


### Return type

**ViewAllMainDepartments200Response**

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

# **viewAllMainDepartments_0**
> ViewAllMainDepartments200Response viewAllMainDepartments_0()



### Example

```typescript
import {
    DepartmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DepartmentsApi(configuration);

let limit: string; // (optional) (default to undefined)
let page: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.viewAllMainDepartments_0(
    limit,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**string**] |  | (optional) defaults to undefined|


### Return type

**ViewAllMainDepartments200Response**

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

# **viewAllSubDepartments**
> ViewAllSubDepartments200Response viewAllSubDepartments()



### Example

```typescript
import {
    DepartmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DepartmentsApi(configuration);

let departmentId: string; // (optional) (default to undefined)
let limit: string; // (optional) (default to undefined)
let page: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.viewAllSubDepartments(
    departmentId,
    limit,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **departmentId** | [**string**] |  | (optional) defaults to undefined|
| **limit** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**string**] |  | (optional) defaults to undefined|


### Return type

**ViewAllSubDepartments200Response**

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

# **viewAllSubDepartments_0**
> ViewAllSubDepartments200Response viewAllSubDepartments_0()



### Example

```typescript
import {
    DepartmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DepartmentsApi(configuration);

let departmentId: string; // (optional) (default to undefined)
let limit: string; // (optional) (default to undefined)
let page: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.viewAllSubDepartments_0(
    departmentId,
    limit,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **departmentId** | [**string**] |  | (optional) defaults to undefined|
| **limit** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**string**] |  | (optional) defaults to undefined|


### Return type

**ViewAllSubDepartments200Response**

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

