import { persistentAtom } from '@nanostores/persistent';

export interface Address {
  id: string;
  name: string;
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

// Lista de direcciones
export const addresses = persistentAtom<Address[]>('addresses', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// Añadir dirección
export function addAddress(address: Omit<Address, 'id'>) {
  const currentAddresses = addresses.get();
  const newAddress: Address = {
    ...address,
    id: Date.now().toString(),
  };

  // Si es la primera dirección o se marca como principal, desmarcar otras
  if (newAddress.isDefault || currentAddresses.length === 0) {
    const updatedAddresses = currentAddresses.map(addr => ({
      ...addr,
      isDefault: false,
    }));
    addresses.set([...updatedAddresses, { ...newAddress, isDefault: true }]);
  } else {
    addresses.set([...currentAddresses, newAddress]);
  }
}

// Actualizar dirección
export function updateAddress(id: string, updates: Partial<Omit<Address, 'id'>>) {
  const currentAddresses = addresses.get();

  // Si se está marcando como principal, desmarcar las demás
  if (updates.isDefault) {
    const updatedAddresses = currentAddresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    addresses.set(updatedAddresses.map(addr =>
      addr.id === id ? { ...addr, ...updates } : addr
    ));
  } else {
    addresses.set(
      currentAddresses.map(addr =>
        addr.id === id ? { ...addr, ...updates } : addr
      )
    );
  }
}

// Eliminar dirección
export function deleteAddress(id: string) {
  const currentAddresses = addresses.get();
  const addressToDelete = currentAddresses.find(addr => addr.id === id);
  const remainingAddresses = currentAddresses.filter(addr => addr.id !== id);

  // Si se elimina la dirección principal y quedan direcciones, marcar la primera como principal
  if (addressToDelete?.isDefault && remainingAddresses.length > 0) {
    remainingAddresses[0].isDefault = true;
  }

  addresses.set(remainingAddresses);
}

// Marcar como dirección principal
export function setDefaultAddress(id: string) {
  const currentAddresses = addresses.get();
  addresses.set(
    currentAddresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }))
  );
}
