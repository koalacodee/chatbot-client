# GuestApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**checkGuestAuth**](#checkguestauth) | **POST** /BASE_URL/auth/guest/check | Check Current Auth Status of a Guest|
|[**getCurrentGuest**](#getcurrentguest) | **GET** /BASE_URL/auth/guest/me | Get the current authorized Guest|
|[**loginGuest**](#loginguest) | **POST** /BASE_URL/auth/guest/login | Login a Guest|
|[**logoutGuest**](#logoutguest) | **POST** /BASE_URL/auth/guest/logout | Logout the current|
|[**refreshGuestTokens**](#refreshguesttokens) | **POST** /BASE_URL/auth/guest/refresh | Refresh Guest Token|
|[**registerGuest**](#registerguest) | **POST** /BASE_URL/auth/guest/register | Register a New Guest Account|
|[**verifyGuestLogin**](#verifyguestlogin) | **POST** /BASE_URL/auth/guest/verify/login | Verify Guest Login|
|[**verifyGuestRegistration**](#verifyguestregistration) | **POST** /BASE_URL/auth/guest/verify/register | Verify Guest Registration|

# **checkGuestAuth**
> object checkGuestAuth()



### Example

```typescript
import {
    GuestApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GuestApi(configuration);

const { status, data } = await apiInstance.checkGuestAuth();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**object**

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

# **getCurrentGuest**
> GetCurrentGuest200Response getCurrentGuest()



### Example

```typescript
import {
    GuestApi,
    Configuration,
    VerifyGuestRegistrationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new GuestApi(configuration);

let verifyGuestRegistrationRequest: VerifyGuestRegistrationRequest; // (optional)

const { status, data } = await apiInstance.getCurrentGuest(
    verifyGuestRegistrationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **verifyGuestRegistrationRequest** | **VerifyGuestRegistrationRequest**|  | |


### Return type

**GetCurrentGuest200Response**

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

# **loginGuest**
> LoginGuest200Response loginGuest()



### Example

```typescript
import {
    GuestApi,
    Configuration,
    LoginGuestRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new GuestApi(configuration);

let loginGuestRequest: LoginGuestRequest; // (optional)

const { status, data } = await apiInstance.loginGuest(
    loginGuestRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginGuestRequest** | **LoginGuestRequest**|  | |


### Return type

**LoginGuest200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **logoutGuest**
> LogoutGuest200Response logoutGuest()



### Example

```typescript
import {
    GuestApi,
    Configuration,
    VerifyGuestRegistrationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new GuestApi(configuration);

let verifyGuestRegistrationRequest: VerifyGuestRegistrationRequest; // (optional)

const { status, data } = await apiInstance.logoutGuest(
    verifyGuestRegistrationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **verifyGuestRegistrationRequest** | **VerifyGuestRegistrationRequest**|  | |


### Return type

**LogoutGuest200Response**

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

# **refreshGuestTokens**
> RefreshGuestTokens200Response refreshGuestTokens()



### Example

```typescript
import {
    GuestApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GuestApi(configuration);

let body: object; // (optional)

const { status, data } = await apiInstance.refreshGuestTokens(
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |


### Return type

**RefreshGuestTokens200Response**

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

# **registerGuest**
> RegisterGuest201Response registerGuest()



### Example

```typescript
import {
    GuestApi,
    Configuration,
    RegisterGuestRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new GuestApi(configuration);

let registerGuestRequest: RegisterGuestRequest; // (optional)

const { status, data } = await apiInstance.registerGuest(
    registerGuestRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerGuestRequest** | **RegisterGuestRequest**|  | |


### Return type

**RegisterGuest201Response**

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

# **verifyGuestLogin**
> VerifyGuestLogin200Response verifyGuestLogin()



### Example

```typescript
import {
    GuestApi,
    Configuration,
    VerifyGuestRegistrationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new GuestApi(configuration);

let verifyGuestRegistrationRequest: VerifyGuestRegistrationRequest; // (optional)

const { status, data } = await apiInstance.verifyGuestLogin(
    verifyGuestRegistrationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **verifyGuestRegistrationRequest** | **VerifyGuestRegistrationRequest**|  | |


### Return type

**VerifyGuestLogin200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **verifyGuestRegistration**
> VerifyGuestRegistration200Response verifyGuestRegistration()



### Example

```typescript
import {
    GuestApi,
    Configuration,
    VerifyGuestRegistrationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new GuestApi(configuration);

let verifyGuestRegistrationRequest: VerifyGuestRegistrationRequest; // (optional)

const { status, data } = await apiInstance.verifyGuestRegistration(
    verifyGuestRegistrationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **verifyGuestRegistrationRequest** | **VerifyGuestRegistrationRequest**|  | |


### Return type

**VerifyGuestRegistration200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

