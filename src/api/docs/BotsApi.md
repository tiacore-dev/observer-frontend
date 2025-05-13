# BotsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addBotApiBotsAddPost**](#addbotapibotsaddpost) | **POST** /api/bots/add | Add Bot|
|[**deleteBotApiBotsBotIdDelete**](#deletebotapibotsbotiddelete) | **DELETE** /api/bots/{bot_id} | Delete Bot|
|[**getBotApiBotsBotIdGet**](#getbotapibotsbotidget) | **GET** /api/bots/{bot_id} | Просмотр промпта|
|[**getBotsApiBotsAllGet**](#getbotsapibotsallget) | **GET** /api/bots/all | Получение списка ботов с фильтрацией|

# **addBotApiBotsAddPost**
> any addBotApiBotsAddPost(registerBotRequest)


### Example

```typescript
import {
    BotsApi,
    Configuration,
    RegisterBotRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BotsApi(configuration);

let registerBotRequest: RegisterBotRequest; //

const { status, data } = await apiInstance.addBotApiBotsAddPost(
    registerBotRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerBotRequest** | **RegisterBotRequest**|  | |


### Return type

**any**

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

# **deleteBotApiBotsBotIdDelete**
> deleteBotApiBotsBotIdDelete()


### Example

```typescript
import {
    BotsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BotsApi(configuration);

let botId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteBotApiBotsBotIdDelete(
    botId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **botId** | [**number**] |  | defaults to undefined|


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

# **getBotApiBotsBotIdGet**
> BotSchema getBotApiBotsBotIdGet()


### Example

```typescript
import {
    BotsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BotsApi(configuration);

let botId: number; //ID просматриваемого промпта (default to undefined)

const { status, data } = await apiInstance.getBotApiBotsBotIdGet(
    botId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **botId** | [**number**] | ID просматриваемого промпта | defaults to undefined|


### Return type

**BotSchema**

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

# **getBotsApiBotsAllGet**
> BotListSchema getBotsApiBotsAllGet()


### Example

```typescript
import {
    BotsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BotsApi(configuration);

let search: string; //Фильтр по названию бота (optional) (default to undefined)
let company: string; // (optional) (default to undefined)
let sortBy: string; //Поле сортировки (optional) (default to undefined)
let order: string; //asc / desc (optional) (default to undefined)
let page: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getBotsApiBotsAllGet(
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
| **search** | [**string**] | Фильтр по названию бота | (optional) defaults to undefined|
| **company** | [**string**] |  | (optional) defaults to undefined|
| **sortBy** | [**string**] | Поле сортировки | (optional) defaults to undefined|
| **order** | [**string**] | asc / desc | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|


### Return type

**BotListSchema**

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

