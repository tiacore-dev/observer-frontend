# CompaniesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addCompanyApiCompaniesAddPost**](#addcompanyapicompaniesaddpost) | **POST** /api/companies/add | Добавление компании|
|[**deleteCompanyApiCompaniesCompanyIdDelete**](#deletecompanyapicompaniescompanyiddelete) | **DELETE** /api/companies/{company_id} | Удаление компании|
|[**editCompanyApiCompaniesCompanyIdPatch**](#editcompanyapicompaniescompanyidpatch) | **PATCH** /api/companies/{company_id} | Редактирование компании|
|[**getCompanyApiCompaniesCompanyIdGet**](#getcompanyapicompaniescompanyidget) | **GET** /api/companies/{company_id} | Просмотр компании|
|[**listCompaniesApiCompaniesAllGet**](#listcompaniesapicompaniesallget) | **GET** /api/companies/all | Список всех компаний|

# **addCompanyApiCompaniesAddPost**
> CompanySchema addCompanyApiCompaniesAddPost(companyCreateSchema)


### Example

```typescript
import {
    CompaniesApi,
    Configuration,
    CompanyCreateSchema
} from './api';

const configuration = new Configuration();
const apiInstance = new CompaniesApi(configuration);

let companyCreateSchema: CompanyCreateSchema; //

const { status, data } = await apiInstance.addCompanyApiCompaniesAddPost(
    companyCreateSchema
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyCreateSchema** | **CompanyCreateSchema**|  | |


### Return type

**CompanySchema**

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteCompanyApiCompaniesCompanyIdDelete**
> deleteCompanyApiCompaniesCompanyIdDelete()


### Example

```typescript
import {
    CompaniesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CompaniesApi(configuration);

let companyId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteCompanyApiCompaniesCompanyIdDelete(
    companyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **editCompanyApiCompaniesCompanyIdPatch**
> editCompanyApiCompaniesCompanyIdPatch(companyEditSchema)


### Example

```typescript
import {
    CompaniesApi,
    Configuration,
    CompanyEditSchema
} from './api';

const configuration = new Configuration();
const apiInstance = new CompaniesApi(configuration);

let companyId: string; // (default to undefined)
let companyEditSchema: CompanyEditSchema; //

const { status, data } = await apiInstance.editCompanyApiCompaniesCompanyIdPatch(
    companyId,
    companyEditSchema
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyEditSchema** | **CompanyEditSchema**|  | |
| **companyId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCompanyApiCompaniesCompanyIdGet**
> CompanySchema getCompanyApiCompaniesCompanyIdGet()


### Example

```typescript
import {
    CompaniesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CompaniesApi(configuration);

let companyId: string; // (default to undefined)

const { status, data } = await apiInstance.getCompanyApiCompaniesCompanyIdGet(
    companyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyId** | [**string**] |  | defaults to undefined|


### Return type

**CompanySchema**

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listCompaniesApiCompaniesAllGet**
> CompanyListResponseSchema listCompaniesApiCompaniesAllGet()


### Example

```typescript
import {
    CompaniesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CompaniesApi(configuration);

const { status, data } = await apiInstance.listCompaniesApiCompaniesAllGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**CompanyListResponseSchema**

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

