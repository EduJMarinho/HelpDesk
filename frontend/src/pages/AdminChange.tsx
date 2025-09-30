// Apresenta um chamado selecionado com um click

import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { SERVICES, SERVICES_KEYS } from "../utils/services";
import type { CalledItemProps } from "../components/CalledItem";
import { NotFound } from "./NotFound";
import { Input } from "../components/input";
import { Button } from "../components/Button";
import LogoImg from "../assets/Logo-HelpDesk.png";

export function AdminChange() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [calledData, setCalledData] = useState<CalledItemProps | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [technicalRemoved, setTechnicalRemoved] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [techPassword, setTechPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTech, setIsTech] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [newTechnical, setNewTechnical] = useState("");
  const [customTechnical, setCustomTechnical] = useState("");
  const [clientList, setClientList] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState("");

  useEffect(() => {
    const example = {
      categoryImg: SERVICES["software"].icon,
      id: "124",
      customer: "João Silva",
      technical: "Luis Santos",
      called: "Instalação e Atualização de Software",
      amount: "R$120,00",
      status: "aberto",  

    };

    if (id === example.id) {
      setCalledData(example);
      setNewStatus(example.status);
      setNewTechnical(example.technical);
    }

    // 🔄 FUTURA INTEGRAÇÃO COM API:
    // fetch(`/api/chamados/${id}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setCalledData(data);
    //     setNewStatus(data.status);
    //     setNewTechnical(data.technical);
    //   });

    // 🔄 LISTA DE CLIENTES
    const stored = localStorage.getItem("calledList");
    if (stored) {
      const list: CalledItemProps[] = JSON.parse(stored);
      const names = Array.from(new Set(list.map((item) => item.customer)));
      setClientList(names);
    }
  }, [id]);


  //substituir essas linhas pelas de baixo
  function handleAdminLogin() {
    if (adminPassword === "helpdesk") {
      setIsAdmin(true);
    } else {
      alert("Senha de administrador incorreta.");
    }
  }

  function handleTechLogin() {
    if (techPassword === "123456") {
      setIsTech(true);
    } else {
      alert("Senha de técnico incorreta.");
    }
  }


// substituir por esse código
// function handleAdminLogin() {
//   if (adminPassword === "helpdesk") {
//     setIsAdmin(true);
//     authenticateWithAPI("admin");
//   } else {
//     alert("Senha de administrador incorreta.");
//   }
// }

// function handleTechLogin() {
//   if (techPassword === "123456") {
//     setIsTech(true);
//     authenticateWithAPI("tech");
//   } else {
//     alert("Senha de técnico incorreta.");
//   }
// }

// function authenticateWithAPI(status) {
//   fetch("https://suaapi.com/autenticar", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ status })
//   })
//     .then(response => response.json())
//     .then(data => {
//       console.log("Autenticação bem-sucedida:", data);
//       // Aqui você pode salvar token, redirecionar, etc.
//     })
//     .catch(error => {
//       console.error("Erro ao autenticar com a API:", error);
//     });
// }


  function updateStatus() {
    if (!calledData) return;
    alert(`Status atualizado para: ${newStatus}`);
  }

  function updateTechnical() {
    if (!calledData) return;

    if (newTechnical === "__remover__") {
      setTechnicalRemoved(true);
      setCalledData({ ...calledData, technical: "" });
      alert("Técnico removido.");
    } else if (newTechnical === "__novo__" && customTechnical.trim() !== "") {
      setTechnicalRemoved(false);
      setCalledData({ ...calledData, technical: customTechnical });
      alert(`Novo técnico incluído: ${customTechnical}`);
    } else {
      setTechnicalRemoved(false);
      setCalledData({ ...calledData, technical: newTechnical });
      alert(`Técnico atualizado para: ${newTechnical}`);
    }
  }

  function addService() {
    if (!calledData || !selectedService) return;

    const service = SERVICES[selectedService as keyof typeof SERVICES];
    const currentAmount = parseFloat(calledData.amount.replace("R$", "").replace(",", "."));
    const updatedAmount = `R$${(currentAmount + service.value).toFixed(2).replace(".", ",")}`;
    const updatedCalled = `${calledData.called}, ${service.name}`;

    setCalledData({
      ...calledData,
      called: updatedCalled,
      amount: updatedAmount,
    });

    alert(`Serviço adicionado: ${service.name}`);
  }

  function deleteClient(name: string) {
    const confirm = window.confirm(`Deseja realmente excluir o cliente "${name}"?`);
    if (!confirm) return;

    const stored = localStorage.getItem("calledList");
    if (stored) {
      const list: CalledItemProps[] = JSON.parse(stored);
      const updatedList = list.filter((item) => item.customer !== name);
      localStorage.setItem("calledList", JSON.stringify(updatedList));
      setClientList(updatedList.map((item) => item.customer));
      alert(`Cliente "${name}" excluído.`);
    }
  }

  if (!calledData) {
  return <NotFound />;

        // return <p className="text-center mt-10">Chamado não encontrado.</p>;
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-orange-100">
      <img
          src={LogoImg}
          alt="DeskHelp"
          className="h-18 mx-auto"
        />
      <div className="bg-neutral-50 rounded-xl px-14 py-2 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-orange-300 mb-4">Detalhes do Chamado</h1>

        <div className="flex flex-col gap-4">
          <img src={calledData.categoryImg} alt="Categoria" className="w-12 h-12" />
          {/* <p><strong>ID:</strong> {calledData.id}</p> */}
          <p><strong>Cliente:</strong> {calledData.customer}</p>
          <p>
            <strong>Técnico:</strong>{" "}
            {technicalRemoved || calledData.technical === ""
              ? <span className="text-red-500">Removido</span>
              : calledData.technical}
          </p>
          <p><strong>Serviço:</strong> {calledData.called}</p>
          <p><strong>Valor:</strong> {calledData.amount}</p>
          <p><strong>Status:</strong> {newStatus}</p>
        </div>

        {!isAdmin && !isTech && (
          <div className="mt-6 flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">Senha de administrador</label>
              <Input
                type="password"
                placeholder="deskhelp"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
              />
              <Button
                className="mt-2 bg-orange-300 hover:bg-amber-800 text-white px-4 py-2 rounded"
                onClick={handleAdminLogin}
              >
                Entrar como Admin
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium">Senha do técnico</label>
              <Input
                type="password"
                placeholder="123456"
                value={techPassword}
                onChange={(e) => setTechPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTechLogin()}
              />
              <Button
                className="mt-2 bg-gray-500 hover:bg-amber-800 text-white px-4 py-2 rounded"
                onClick={handleTechLogin}
              >
                Entrar como Técnico
              </Button>
            </div>
          </div>
        )}

        

        {(isAdmin || isTech) && (
          <div className="mt-6 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Alterar Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && updateStatus()}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="aberto">Aberto</option>
                <option value="em atendimento">Em atendimento</option>
                <option value="encerrado">Encerrado</option>
              </select>
              <Button
                className="mt-2 bg-orange-300 hover:bg-amber-800 text-white px-4 py-2 rounded"
                onClick={updateStatus}
              >
                Confirmar Status
              </Button>
            </div>

            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Técnico</label>
                <select
                  value={newTechnical}
                  onChange={(e) => setNewTechnical(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && updateTechnical()}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="">Selecione ou remova</option>
                  <option value="__remover__">Remover Técnico</option>
                  <option value="Carlos Silva">Carlos Silva</option>
                                   <option value="Mariana Rocha">Mariana Rocha</option>
                  <option value="__novo__">Adicionar novo técnico</option>
                </select>

                {newTechnical === "__novo__" && (
                  <Input
                    type="text"
                    placeholder="Nome do novo técnico"
                    value={customTechnical}
                    onChange={(e) => setCustomTechnical(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && updateTechnical()}
                    className="mt-2"
                  />
                )}

                <Button
                  className="mt-2 bg-gray-500 hover:bg-amber-800 text-white px-4 py-2 rounded"
                  onClick={updateTechnical}
                >
                  Confirmar Técnico
                </Button>
              </div>
            )}

            {isTech && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Adicionar Serviço</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addService()}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="">Selecione um serviço</option>
                  {SERVICES_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {SERVICES[key].name}
                    </option>
                  ))}
                </select>
                <Button
                  className="mt-2 bg-gray-500 hover:bg-amber-800 text-white px-4 py-2 rounded"
                  onClick={addService}
                >
                  Adicionar Serviço
                </Button>
              </div>
            )}

{isAdmin && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mt-6">Selecionar Cliente</label>
    <select
      value={selectedClient}
      onChange={(e) => setSelectedClient(e.target.value)}
      className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
    >
      <option value="">Selecione um cliente</option>
      {clientList.map((name) => (
        <option key={name} value={name}>{name}</option>
      ))}
    </select>
    <Button
      className="mt-2 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
      onClick={() => {
        if (selectedClient) {
          deleteClient(selectedClient);
          setSelectedClient("");
        } else {
          alert("Selecione um cliente para excluir.");
        }
      }}
    >
      Excluir Cliente
    </Button>
  </div>
)}


          </div>
        )}

        <Button
          className="mt-6 bg-orange-300 hover:bg-amber-800 text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}










// import { useParams, useNavigate } from "react-router";
// import { useEffect, useState } from "react";
// import { SERVICES, SERVICES_KEYS } from "../utils/services";
// import type { CalledItemProps } from "../components/CalledItem";
// import { Input } from "../components/input";
// import { Button } from "../components/Button";

// export function AdminChange() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [calledData, setCalledData] = useState<CalledItemProps | null>(null);
//   const [newStatus, setNewStatus] = useState("");
//   const [technicalRemoved, setTechnicalRemoved] = useState(false);
//   const [adminPassword, setAdminPassword] = useState("");
//   const [techPassword, setTechPassword] = useState("");
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isTech, setIsTech] = useState(false);
//   const [selectedService, setSelectedService] = useState("");
//   const [newTechnical, setNewTechnical] = useState("");
//   const [customTechnical, setCustomTechnical] = useState("");

//   useEffect(() => {
//     const example = {
//       categoryImg: SERVICES["printer"].icon,
//       id: "123",
//       customer: "Ana Clara Ferreira",
//       technical: "Eduardo José Marinho",
//       called: "Suporte a Impressoras e periféricos",
//       amount: "R$85,00",
//       status: "aberto",
//     };

//     if (id === example.id) {
//       setCalledData(example);
//       setNewStatus(example.status);
//       setNewTechnical(example.technical);
//     }

//     // 🔄 FUTURA INTEGRAÇÃO COM API:
//     // fetch(`/api/chamados/${id}`)
//     //   .then(res => res.json())
//     //   .then(data => {
//     //     setCalledData(data);
//     //     setNewStatus(data.status);
//     //     setNewTechnical(data.technical);
//     //   });
//   }, [id]);

//   function handleAdminLogin() {
//     if (adminPassword === "deskhelp") {
//       setIsAdmin(true);
//     } else {
//       alert("Senha de administrador incorreta.");
//     }
//   }

//   function handleTechLogin() {
//     if (techPassword === "123456") {
//       setIsTech(true);
//     } else {
//       alert("Senha de técnico incorreta.");
//     }
//   }

//   function updateStatus() {
//     if (!calledData) return;
//     alert(`Status atualizado para: ${newStatus}`);
//   }

//   function updateTechnical() {
//     if (!calledData) return;

//     if (newTechnical === "__remover__") {
//       setTechnicalRemoved(true);
//       setCalledData({ ...calledData, technical: "" });
//       alert("Técnico removido.");
//     } else if (newTechnical === "__novo__" && customTechnical.trim() !== "") {
//       setTechnicalRemoved(false);
//       setCalledData({ ...calledData, technical: customTechnical });
//       alert(`Novo técnico incluído: ${customTechnical}`);
//     } else {
//       setTechnicalRemoved(false);
//       setCalledData({ ...calledData, technical: newTechnical });
//       alert(`Técnico atualizado para: ${newTechnical}`);
//     }
//   }

//   function addService() {
//     if (!calledData || !selectedService) return;

//     const service = SERVICES[selectedService as keyof typeof SERVICES];
//     const currentAmount = parseFloat(calledData.amount.replace("R$", "").replace(",", "."));
//     const updatedAmount = `R$${(currentAmount + service.value).toFixed(2).replace(".", ",")}`;
//     const updatedCalled = `${calledData.called}, ${service.name}`;

//     setCalledData({
//       ...calledData,
//       called: updatedCalled,
//       amount: updatedAmount,
//     });

//     alert(`Serviço adicionado: ${service.name}`);
//   }

//   if (!calledData) {
//     return <p className="text-center mt-10">Chamado não encontrado.</p>;
//   }

//   return (
//     <div
//      className="min-h-screen flex items-center justify-center  bg-orange-100">
    
//     <div className="bg-neutral-50 rounded-xl p-10 max-w-2xl mx-auto">
//       <h1 className="text-xl font-bold text-orange-300 mb-4">Detalhes do Chamado</h1>

//       <div className="flex flex-col gap-4">
//         <img src={calledData.categoryImg} alt="Categoria" className="w-12 h-12" />
//         <p><strong>ID:</strong> {calledData.id}</p>
//         <p><strong>Cliente:</strong> {calledData.customer}</p>
//         <p>
//           <strong>Técnico:</strong>{" "}
//           {technicalRemoved || calledData.technical === ""
//             ? <span className="text-red-500">Removido</span>
//             : calledData.technical}
//         </p>
//         <p><strong>Serviço:</strong> {calledData.called}</p>
//         <p><strong>Valor:</strong> {calledData.amount}</p>
//         <p><strong>Status:</strong> {newStatus}</p>
//       </div>

//       {!isAdmin && !isTech && (
//         <div className="mt-6 flex flex-col gap-4">
//           <div>
//             <label className="text-sm font-medium">Senha de administrador</label>
//             <Input
//               type="password"
//               placeholder="deskhelp"
//               value={adminPassword}
//               onChange={(e) => setAdminPassword(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
//             />
//             <Button
//               className="mt-2 bg-orange-300 hover:bg-amber-800 text-white px-4 py-2 rounded"
//               onClick={handleAdminLogin}
//             >
//               Entrar como Admin
//             </Button>
//           </div>

//           <div>
//             <label className="text-sm font-medium">Senha do técnico</label>
//             <Input
//               type="password"
//               placeholder="123456"
//               value={techPassword}
//               onChange={(e) => setTechPassword(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleTechLogin()}
//             />
//             <Button
//               className="mt-2 bg-gray-500 hover:bg-amber-800 text-white px-4 py-2 rounded"
//               onClick={handleTechLogin}
//             >
//               Entrar como Técnico
//             </Button>
//           </div>
//         </div>
//       )}

//       {(isAdmin || isTech) && (
//         <div className="mt-6 flex flex-col gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Alterar Status</label>
//             <select
//               value={newStatus}
//               onChange={(e) => setNewStatus(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && updateStatus()}
//               className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
//             >
//               <option value="aberto">Aberto</option>
//               <option value="em atendimento">Em atendimento</option>
//               <option value="encerrado">Encerrado</option>
//             </select>
//             <Button
//               className="mt-2 bg-orange-300 hover:bg-amber-800 text-white px-4 py-2 rounded"
//               onClick={updateStatus}
//             >
//               Confirmar Status
//             </Button>
//           </div>

//           {isAdmin && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Técnico</label>
//               <select
//                 value={newTechnical}
//                 onChange={(e) => setNewTechnical(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && updateTechnical()}
//                 className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
//               >
//                 <option value="">Selecione ou remova</option>
//                 <option value="__remover__">Remover Técnico</option>
//                 <option value="Carlos Silva">Carlos Silva</option>
//                 <option value="Mariana Rocha">Mariana Rocha</option>
//                 <option value="__novo__">Adicionar novo técnico</option>
//               </select>

//               {newTechnical === "__novo__" && (
//                 <Input
//                   type="text"
//                   placeholder="Nome do novo técnico"
//                   value={customTechnical}
//                   onChange={(e) => setCustomTechnical(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && updateTechnical()}
//                   className="mt-2"
//                 />
//               )}

//               <Button
//                 className="mt-2 bg-gray-500 hover:bg-amber-800 text-white px-4 py-2 rounded"
//                 onClick={updateTechnical}
//               >
//                 Confirmar Técnico
//               </Button>
//             </div>

//           )}

//                     {isTech && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Adicionar Serviço</label>
//               <select
//                 value={selectedService}
//                 onChange={(e) => setSelectedService(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && addService()}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//               >
//                 <option value="">Selecione um serviço</option>
//                 {SERVICES_KEYS.map((key) => (
//                   <option key={key} value={key}>
//                     {SERVICES[key].name}
//                   </option>
//                 ))}
//               </select>
//               <Button
//                 className="mt-2 bg-gray-500 hover:bg-amber-800 text-white px-4 py-2 rounded"
//                 onClick={addService}
//               >
//                 Adicionar Serviço
//               </Button>
//             </div>
//           )}
//         </div>
//       )}

//       <Button
//         className="mt-6 bg-orange-300 hover:bg-amber-800 text-white px-4 py-2 rounded"
//         onClick={() => navigate(-1)}
//       >
//         Voltar
//       </Button>
//     </div>
//     </div>
//   );
// }