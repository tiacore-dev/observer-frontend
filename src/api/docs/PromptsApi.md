# PromptsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addPromptApiPromptsAddPost**](#addpromptapipromptsaddpost) | **POST** /api/prompts/add | Добавление новой промпта|
|[**deletePromptApiPromptsPromptIdDelete**](#deletepromptapipromptspromptiddelete) | **DELETE** /api/prompts/{prompt_id} | Удаление промпта|
|[**editPromptApiPromptsPromptIdPatch**](#editpromptapipromptspromptidpatch) | **PATCH** /api/prompts/{prompt_id} | Изменение промпта|
|[**getPromptApiPromptsPromptIdGet**](#getpromptapipromptspromptidget) | **GET** /api/prompts/{prompt_id} | Просмотр промпта|
|[**getPromptsApiPromptsAllGet**](#getpromptsapipromptsallget) | **GET** /api/prompts/all | Получение списка промптов с фильтрацией|

# **addPromptApiPromptsAddPost**
> PromptResponseSchema addPromptApiPromptsAddPost(promptCreateSchema)


### Example

```typescript
import {
    PromptsApi,
    Configuration,
    PromptCreateSchema
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let promptCreateSchema: PromptCreateSchema; //

const { status, data } = await apiInstance.addPromptApiPromptsAddPost(
    promptCreateSchema
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptCreateSchema** | **PromptCreateSchema**|  | |


### Return type

**PromptResponseSchema**

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

# **deletePromptApiPromptsPromptIdDelete**
> deletePromptApiPromptsPromptIdDelete()


### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let promptId: string; //ID удаляемой промпта (default to undefined)

const { status, data } = await apiInstance.deletePromptApiPromptsPromptIdDelete(
    promptId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptId** | [**string**] | ID удаляемой промпта | defaults to undefined|


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

# **editPromptApiPromptsPromptIdPatch**
> editPromptApiPromptsPromptIdPatch(promptEditSchema)

Обновление промпта по ID, переданному в URL.

### Example

```typescript
import {
    PromptsApi,
    Configuration,
    PromptEditSchema
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let promptId: string; //ID изменяемой промпта (default to undefined)
let promptEditSchema: PromptEditSchema; //

const { status, data } = await apiInstance.editPromptApiPromptsPromptIdPatch(
    promptId,
    promptEditSchema
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptEditSchema** | **PromptEditSchema**|  | |
| **promptId** | [**string**] | ID изменяемой промпта | defaults to undefined|


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

# **getPromptApiPromptsPromptIdGet**
> PromptSchema getPromptApiPromptsPromptIdGet()


### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let promptId: string; //ID просматриваемого промпта (default to undefined)

const { status, data } = await apiInstance.getPromptApiPromptsPromptIdGet(
    promptId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptId** | [**string**] | ID просматриваемого промпта | defaults to undefined|


### Return type

**PromptSchema**

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

# **getPromptsApiPromptsAllGet**
> PromptListResponseSchema getPromptsApiPromptsAllGet()


### Example

```typescript
import {
    PromptsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptsApi(configuration);

let search: string; //Фильтр по названию промпта (optional) (default to undefined)
let company: string; // (optional) (default to undefined)
let sortBy: string; //Поле сортировки (optional) (default to undefined)
let order: string; //asc / desc (optional) (default to undefined)
let page: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getPromptsApiPromptsAllGet(
    search,
    company,
    sortBy,
    order,
    page,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **search** | [**string**] | Фильтр по названию промпта | (optional) defaults to undefined|
| **company** | [**string**] |  | (optional) defaults to undefined|
| **sortBy** | [**string**] | Поле сортировки | (optional) defaults to undefined|
| **order** | [**string**] | asc / desc | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|


### Return type

**PromptListResponseSchema**

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

