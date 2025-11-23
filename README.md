# Escuela Colombiana de Ingeniería  
## Software Architecture - ARSW

# **Scaling in Azure with Virtual Machines, Scale Sets, and Service Plans**

## **Authors**

- **Santiago Hurtado Martínez** — [SantiagoHM20](https://github.com/SantiagoHM20)  
- **Mayerlly Suárez Correa** — [mayerllyyo](https://github.com/mayerllyyo)

---

## Dependencies
* Create a free Azure account. You can follow this [documentation](https://azure.microsoft.com/es-es/free/students/). Once created, you will have **$100 USD** to spend for 12 months.
* Before starting the lab, review the following documentation about [Azure Functions](https://www.c-sharpcorner.com/article/an-overview-of-azure-functions/).

---

## Part 0 – Understanding the Quality Scenario

Attached to this lab, you will find a fully developed application whose purpose is to compute the *n*-th value of the Fibonacci sequence.

### **Scalability Requirement**
When a group of users concurrently requests an *n*-th Fibonacci number (greater than 1,000,000) and the system is under normal operating conditions:
- All requests must be handled successfully.
- CPU usage must **not exceed 70%**.

---

## Serverless Scalability (Functions)

1. Create a Function App exactly as shown in the images:

![](images/part3/part3-function-config.png)

![](images/part3/part3-function-configii.png)

2. Install the **Azure Functions** extension for Visual Studio Code.

![](images/part3/part3-install-extension.png)

3. Deploy the Fibonacci Function to Azure using Visual Studio Code.  
   The first time, you will be prompted to authenticate — follow the instructions.

![](images/part3/part3-deploy-function-1.png)

![](images/part3/part3-deploy-function-2.png)

5:37:24 PM FunctionScalabilityLab2: Creating zip package...
5:37:24 PM FunctionScalabilityLab2: Adding 17 files to zip package...
5:37:24 PM FunctionScalabilityLab2: f:\escritorio\ARSW_LOAD-BALANCING_AZURE_II\FunctionProject\proxies.json
5:37:24 PM FunctionScalabilityLab2: f:\escritorio\ARSW_LOAD-BALANCING_AZURE_II\FunctionProject\package.json
5:37:24 PM FunctionScalabilityLab2: f:\escritorio\ARSW_LOAD-BALANCING_AZURE_II\FunctionProject\package-lock.json
5:37:24 PM FunctionScalabilityLab2: f:\escritorio\ARSW_LOAD-BALANCING_AZURE_II\FunctionProject\host.json
5:37:24 PM FunctionScalabilityLab2: f:\escritorio\ARSW_LOAD-BALANCING_AZURE_II\FunctionProject\node_modules\.package-lock.json
5:37:24 PM FunctionScalabilityLab2: f:\escritorio\ARSW_LOAD-BALANCING_AZURE_II\FunctionProject\Fibonacci\sample.dat
5:37:24 PM FunctionScalabilityLab2: f:\escritorio\ARSW_LOAD-BALANCING_AZURE_II\FunctionProject\Fibonacci\index.js
5:37:24 PM FunctionScalabilityLab2: f:\escritorio\ARSW_LOAD-BALANCING_AZURE_II\FunctionProject\Fibonacci\function.json
5:37:24 PM FunctionScalabilityLab2: f:\escritorio\ARSW_LOAD-BALANCING_AZURE_II\FunctionProject\.funcignore
5:37:24 PM FunctionScalabilityLab2: f:\escritorio\ARSW_LOAD-BALANCING_AZURE_II\FunctionProject\node_modules\big-integer\tsconfig.json
...
5:37:34 PM FunctionScalabilityLab2: Deployment successful.
5:37:35 PM FunctionScalabilityLab2: Started postDeployTask "npm install".
5:37:46 PM FunctionScalabilityLab2: Syncing triggers...
5:38:22 PM FunctionScalabilityLab2: HTTP Trigger Urls:
Fibonacci: https://functionscalabilitylab2-cwgscyhtb9cvb3cf.canadacentral-01.azurewebsites.net/api/fibonacci


4. Go to the Azure Portal and test the function.

![](images/part3/part3-test-function.png)

5. Modify the POSTMAN collection using **NEWMAN** so that it can send **10 concurrent requests**. Verify the results and write a report.

6. Create a new Function implementing Fibonacci using a **recursive solution with memoization**.  
   Test the function multiple times. Then do nothing for at least **5 minutes**. Test the function again using the same input values.

   **Describe the observed behavior.**

---

# **Questions and Answers**

### **1. What is an Azure Function?**
An **Azure Function** is a serverless compute service that executes small pieces of code (“functions”) in response to events such as HTTP requests, timers, queues, or messages. It allows developers to run logic without managing infrastructure.

---

### **2. What is serverless?**
**Serverless** is a cloud execution model where:
- The developer does **not** manage servers or infrastructure.
- Resources scale automatically based on demand.
- Billing is based on **actual usage** (execution time, memory, number of requests).

The cloud provider handles provisioning, scaling, fault tolerance, and availability.

---

### **3. What is the runtime, and what does selecting it imply when creating a Function App?**
The **runtime** defines:
- The **language stack** (Node.js, Python, .NET, Java, etc.)
- The hosting environment where the function will be executed.

Selecting the runtime implies:
- Compatibility with your source code.
- The specific versions of language features and libraries available.
- Deployment requirements (e.g., .NET isolated worker vs. .NET in-process).

---

### **4. Why is it necessary to create a Storage Account when creating a Function App?**
Azure Functions require a **Storage Account** for:
- Storing triggers and bindings metadata.
- Managing internal logs and executions.
- Checkpointing for durable functions.
- Maintaining deployment packages in some hosting plans.

Without a Storage Account, the Function App cannot operate.

---

### **5. What are the types of plans for a Function App? How do they differ?**  
### **Advantages and disadvantages of each**

#### **1. Consumption Plan**
- **Auto-scales** based on demand.
- Pay **per execution**, execution time, and memory.
- Cold starts occur when the function is not used for a while.

**Pros**
- Cheapest option for irregular workloads.
- Infinite scaling.

**Cons**
- Cold start latency.
- Limited execution time (max ~10 minutes).

---

#### **2. Premium Plan**
- Eliminates cold starts.
- Supports VNET integration and unlimited execution time.
- Auto-scales, but with minimum dedicated instances.

**Pros**
- No cold starts → faster performance.
- More powerful hardware.

**Cons**
- More expensive than the Consumption Plan.

---

#### **3. Dedicated (App Service) Plan**
- Uses dedicated VMs from App Service.
- Best for always-running functions.

**Pros**
- No execution time limits.
- No cold starts.
- Good when the VM is already being paid for other services.

**Cons**
- Most expensive option.
- Scaling is manual or preconfigured.

---

### **6. Why does memoization fail or not work correctly?**
Because Azure Functions in serverless environments are **stateless** by design.

Reasons memoization fails:
- Instances are **destroyed** after inactivity (cold start).
- Another request may be served by a **different instance** with an empty memory cache.
- Memory is **not shared** between function instances.
- Scaling out creates multiple copies of the function, each with its own isolated memory.

Thus, memoization only works **temporarily** and only if:
- The same instance is reused.
- The Function App does not scale out or restart.

---

### **7. How does billing work for Function Apps?**

#### **Consumption Plan**
- Pay for:
  - Number of executions
  - Execution time (GB-seconds)
  - Memory allocated
- First **1 million executions per month are free**.

#### **Premium Plan**
- Pay for:
  - Number of core seconds allocated
  - Number of pre-warmed instances
  - Scaling instances

#### **Dedicated Plan**
- Pay for the underlying App Service Plan (fixed monthly cost), regardless of usage.

---


