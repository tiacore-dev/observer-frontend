# MonitoringApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**monitoringMetricsGet**](#monitoringmetricsget) | **GET** /metrics | Monitoring|

# **monitoringMetricsGet**
> any monitoringMetricsGet()


### Example

```typescript
import {
    MonitoringApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MonitoringApi(configuration);

const { status, data } = await apiInstance.monitoringMetricsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

