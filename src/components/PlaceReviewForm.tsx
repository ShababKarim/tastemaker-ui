'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ItemCategory, Place, PlaceReviewInput } from '@/lib/types';

export type PlaceReviewFormProps = {
  place: Place;
  value: PlaceReviewInput;
  onSubmit?: (value: PlaceReviewInput) => Promise<void> | void;
  submittingText?: string;
};

const categories: ItemCategory[] = ['Entree', 'App', 'Dessert', 'Drink'];

export default function PlaceReviewForm({
  place,
  value,
  onSubmit,
  submittingText = 'Saving review...',
}: PlaceReviewFormProps) {
  const [form, setForm] = useState<PlaceReviewInput>(() => ({ ...value }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: '',
          category: 'Entree',
          price: '',
          rating: 0,
          rank: prev.items.length + 1,
          photoUrl: '',
          notes: '',
        },
      ],
    }));
  };

  const removeItem = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const updateItem = (idx: number, patch: Partial<ItemReviewInput>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    }));
  };

  const setField = <K extends keyof PlaceReviewInput>(key: K, val: PlaceReviewInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleItemFile = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateItem(idx, { photoUrl: url });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.placeId) e['placeId'] = 'Place is required';
    if (!form.userId) e['userId'] = 'User is required';
    if (form.rating < 0 || form.rating > 5) e['rating'] = 'Overall rating must be 0–5';

    form.items.forEach((it, idx) => {
      if (!it.name?.trim()) e[`item_${idx}_name`] = 'Name is required';
      if (!categories.includes(it.category)) e[`item_${idx}_category`] = 'Category invalid';
      if (it.rating < 0 || it.rating > 5) e[`item_${idx}_rating`] = 'Rating must be 0–5';
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      await onSubmit?.(form);
      // show a basic toast via alert for now
      alert('Review saved (mock)');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      {/* Left panel: hero image and item list akin to Pinterest pin compose */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body gap-4">
          <figure className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-base-300 ring-1 ring-base-300/50">
            <Image src={place.photoUrl} alt={place.name} fill className="object-cover" />
          </figure>
          <div className="divider my-0"></div>
          <h3 className="card-title">{place.name}</h3>
          <p className="text-sm text-base-content/70">{place.address}</p>
        </div>
      </div>

      {/* Right panel: overall review meta */}
      <div className="card bg-base-200 shadow-sm h-max">
        <div className="card-body gap-4">
          <h3 className="card-title">Overall</h3>
          <div className="grid grid-cols-1 gap-3">
            <label className="form-control">
              <div className="label">
                <span className="label-text text-base-content/60">Overall Rating (0–5)</span>
              </div>
              <input
                type="number"
                min={0}
                max={5}
                step={1}
                className={`input input-bordered ${errors['rating'] ? 'input-error' : ''}`}
                value={form.rating}
                onChange={(e) => setField('rating', Number(e.target.value))}
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text text-base-content/60">Overall Rank</span>
              </div>
              <input
                type="number"
                min={1}
                className="input input-bordered"
                value={form.rank}
                onChange={(e) => setField('rank', Number(e.target.value))}
              />
            </label>
          </div>

          <div className="divider"></div>

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Items</h3>
            <button type="button" className="btn btn-sm btn-primary" onClick={addItem} aria-label="Add item">
              + Add item
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {form.items.length === 0 && (
              <div className="text-sm text-base-content/60">No items yet. Add your first dish/drink.</div>
            )}
            {form.items.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-base-300 p-4 bg-base-100">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-base-200">
                    {item.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.photoUrl} alt={item.name || 'Item'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-xs text-base-content/60">No photo</div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                    <label className="form-control">
                      <div className="label">
                        <span className="label-text">Name</span>
                      </div>
                      <input
                        className={`input input-bordered input-sm ${errors[`item_${idx}_name`] ? 'input-error' : ''}`}
                        value={item.name}
                        onChange={(e) => updateItem(idx, { name: e.target.value })}
                        placeholder="e.g., Margherita Pizza"
                      />
                    </label>

                    <label className="form-control">
                      <div className="label">
                        <span className="label-text">Category</span>
                      </div>
                      <select
                        className={`select select-bordered select-sm ${errors[`item_${idx}_category`] ? 'select-error' : ''}`}
                        value={item.category}
                        onChange={(e) => updateItem(idx, { category: e.target.value as ItemCategory })}
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="form-control">
                      <div className="label">
                        <span className="label-text">Price</span>
                      </div>
                      <input
                        className="input input-bordered input-sm"
                        value={item.price}
                        onChange={(e) => updateItem(idx, { price: e.target.value })}
                        placeholder="$12.50"
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="form-control">
                        <div className="label">
                          <span className="label-text">Rating (0–5)</span>
                        </div>
                        <input
                          type="number"
                          min={0}
                          max={5}
                          step={1}
                          className={`input input-bordered input-sm ${errors[`item_${idx}_rating`] ? 'input-error' : ''}`}
                          value={item.rating}
                          onChange={(e) => updateItem(idx, { rating: Number(e.target.value) })}
                        />
                      </label>

                      <label className="form-control">
                        <div className="label">
                          <span className="label-text">Rank</span>
                        </div>
                        <input
                          type="number"
                          min={1}
                          className="input input-bordered input-sm"
                          value={item.rank}
                          onChange={(e) => updateItem(idx, { rank: Number(e.target.value) })}
                        />
                      </label>
                    </div>

                    <div className="md:col-span-2 flex items-center gap-3">
                      <input
                        id={`item_file_${idx}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleItemFile(idx, e)}
                      />
                      <label htmlFor={`item_file_${idx}`} className="btn btn-sm">
                        Upload photo
                      </label>
                      <span className="text-xs text-base-content/60">JPG, PNG, or GIF</span>
                    </div>

                    <label className="form-control md:col-span-2">
                      <div className="label">
                        <span className="label-text">Notes</span>
                      </div>
                      <textarea
                        className="textarea textarea-bordered textarea-sm"
                        value={item.notes}
                        onChange={(e) => updateItem(idx, { notes: e.target.value })}
                        placeholder="Tasting notes, preparation, what you liked..."
                      />
                    </label>
                  </div>

                  <div className="shrink-0">
                    <button type="button" className="btn btn-ghost btn-xs" onClick={() => removeItem(idx)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="divider"></div>

          <button type="submit" className={`btn btn-primary ${submitting ? 'btn-disabled' : ''}`} disabled={submitting}>
            {submitting ? submittingText : 'Save Review'}
          </button>
        </div>
      </div>
    </form>
  );
}
