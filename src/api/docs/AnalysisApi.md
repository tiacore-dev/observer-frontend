# AnalysisApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAnalysisApiAnalysisCreatePost**](#createanalysisapianalysiscreatepost) | **POST** /api/analysis/create | Добавление новой промпта|
|[**getAnalysesApiAnalysisAllGet**](#getanalysesapianalysisallget) | **GET** /api/analysis/all | Получение списка анализов с фильтрацией|
|[**getAnalysisApiAnalysisAnalysisIdGet**](#getanalysisapianalysisanalysisidget) | **GET** /api/analysis/{analysis_id} | Просмотр анализа|

# **createAnalysisApiAnalysisCreatePost**
> AnalysisResponseSchema createAnalysisApiAnalysisCreatePost(analysisCreateSchema)


### Example

```typescript
import {
    AnalysisApi,
    Configuration,
    AnalysisCreateSchema
} from './api';

const configuration = new Configuration();
const apiInstance = new AnalysisApi(configuration);

let analysisCreateSchema: AnalysisCreateSchema; //

const { status, data } = await apiInstance.createAnalysisApiAnalysisCreatePost(
    analysisCreateSchema
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **analysisCreateSchema** | **AnalysisCreateSchema**|  | |


### Return type

**AnalysisResponseSchema**

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

# **getAnalysesApiAnalysisAllGet**
> AnalysisListSchema getAnalysesApiAnalysisAllGet()


### Example

```typescript
import {
    AnalysisApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnalysisApi(configuration);

let company: string; // (optional) (default to undefined)
let chat: string; // (optional) (default to undefined)
let schedule: string; // (optional) (default to undefined)
let sortBy: string; //Поле сортировки (optional) (default to undefined)
let order: string; //asc / desc (optional) (default to undefined)
let page: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getAnalysesApiAnalysisAllGet(
    company,
    chat,
    schedule,
    sortBy,
    order,
    page,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **company** | [**string**] |  | (optional) defaults to undefined|
| **chat** | [**string**] |  | (optional) defaults to undefined|
| **schedule** | [**string**] |  | (optional) defaults to undefined|
| **sortBy** | [**string**] | Поле сортировки | (optional) defaults to undefined|
| **order** | [**string**] | asc / desc | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|


### Return type

**AnalysisListSchema**

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

# **getAnalysisApiAnalysisAnalysisIdGet**
> AnalysisSchema getAnalysisApiAnalysisAnalysisIdGet()


### Example

```typescript
import {
    AnalysisApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnalysisApi(configuration);

let analysisId: string; //ID просматриваемого анализа (default to undefined)

const { status, data } = await apiInstance.getAnalysisApiAnalysisAnalysisIdGet(
    analysisId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **analysisId** | [**string**] | ID просматриваемого анализа | defaults to undefined|


### Return type

**AnalysisSchema**

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

